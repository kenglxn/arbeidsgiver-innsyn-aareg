const path = require('path');
const express = require('express');
const BASE_PATH = '/arbeidsforhold';
const server = express();
const mustacheExpress = require('mustache-express');
const getDecorator = require('./decorator');
const Promise = require('promise');
const createEnvSettingsFile = require('./envSettings.js');

const sonekrysning = require('./sonekrysningConfig.js');
const sonekrysningArbeidsforholdApi = require('./sonekrysningConfigArbeidsforhold-api');
const veilarbStatusProxyConfig = require('./veilarbStatusProxyConfig');
const enkeltArbeidsforholdProxyConfig = require('./enkeltArbeidsforholdProxy');

const buildPath = path.join(__dirname, '../../build');
const port = process.env.PORT || 3000;

server.use(`${BASE_PATH}/api`, sonekrysning);
server.use(`/arbeidsgiver-arbeidsforhold/api/test/`, sonekrysningArbeidsforholdApi);
server.use(`${BASE_PATH}/veilarbstepup/status`, veilarbStatusProxyConfig);
server.use(
    `${BASE_PATH}/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver`,
    enkeltArbeidsforholdProxyConfig
);

server.engine('html', mustacheExpress());
server.set('view engine', 'mustache');
server.set('views', buildPath);

createEnvSettingsFile(path.resolve(`${buildPath}/static/js/settings.js`));

server.get(`${BASE_PATH}/redirect-til-login`, (req, res) => {
    const loginUrl =
        process.env.LOGIN_URL ||
        'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/arbeidsforhold';
    res.redirect(loginUrl);
});

const renderApp = decoratorFragments =>
    new Promise((resolve, reject) => {
        server.render('index.html', decoratorFragments, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const startServer = html => {
    console.log('start server');
    server.use(BASE_PATH, express.static(buildPath, { index: false }));

    setInternalEndpoints();
    server.get(`${BASE_PATH}/*`, (req, res) => {
        res.send(html);
    });
    server.listen(port, () => {
        console.log('Server listening on port', port);
    });
};

const startMockServer = html => {
    console.log('start server');
    server.use(BASE_PATH, express.static(buildPath));

    setInternalEndpoints();

    server.get(`${BASE_PATH}/*`, (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
    server.listen(port, () => {
        console.log('Server listening on port', port);
    });
};

const setInternalEndpoints = () => {
    server.get(`${BASE_PATH}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`${BASE_PATH}/internal/isReady`, (req, res) => res.sendStatus(200));
};

if (process.env.REACT_APP_MOCK) {
    startMockServer();
} else {
    getDecorator()
        .then(renderApp, error => {
            console.error('Kunne ikke hente dekoratør ', error);
            process.exit(1);
        })
        .then(startServer, error => {
            console.error('Kunne ikke rendre app ', error);
            process.exit(1);
        });
}
