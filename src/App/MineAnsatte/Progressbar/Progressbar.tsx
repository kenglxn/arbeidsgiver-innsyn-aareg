import React, { useState } from 'react';
import './Progressbar.less';
import { Ingress } from 'nav-frontend-typografi';

interface Props {
    startTid: number;
    erFerdigLastet: boolean;
    setSkalvises: (vises: boolean) => void;
    antall: number;
}

const beregnTid = (antallForhold: number) => {
    if (antallForhold === -1) {
        return 10000;
    }
    if (antallForhold < 700 && antallForhold > 0) {
        const tidForAhenteNavn = antallForhold * 12;
        return tidForAhenteNavn + 2000;
    } else if (antallForhold > 700) {
        const tidForAhenteNavn = antallForhold * 12;
        return 5000 + tidForAhenteNavn;
    }
    return 0;
};

const beregnBreddeMedForsinkelse = (forsinkelsesparameter: number, naVarendeBredde: number, beregnetBredde: number) => {
    const okning = beregnetBredde - naVarendeBredde;
    const breddeMEdForsinkelse = naVarendeBredde + okning / forsinkelsesparameter;
    return breddeMEdForsinkelse;
};

const Progressbar = ({ startTid, erFerdigLastet, setSkalvises, antall }: Props) => {
    const [tid, setTid] = useState(0);
    const [bredde, setBredde] = useState(0);
    const [forsinkelsesparameter, setForsinkelsesparameter] = useState(1);

    const beregnetTid = beregnTid(antall);
    const element = document.getElementById('progressbar__fyll');

    if (bredde >= 95 && erFerdigLastet) {
        setSkalvises(false);
    } else {
        if (!erFerdigLastet) {
            if (tid / beregnetTid < 0.98) {
                setTimeout(() => {
                    const element = document.getElementById('progressbar__fyll');
                    if (element) {
                        const naVarendeTid = new Date().getTime();
                        const beregnetBredde = (tid / beregnetTid) * 100;
                        if (bredde >= 80 && bredde < 96) {
                            setForsinkelsesparameter(forsinkelsesparameter * 1.05);
                            setBredde(beregnBreddeMedForsinkelse(forsinkelsesparameter, bredde, beregnetBredde));
                        }
                        if (bredde < 80) {
                            setBredde(beregnetBredde);
                        }
                        element.style.width = bredde.toString() + '%';
                        const tidGatt = naVarendeTid - startTid;
                        setTid(tidGatt);
                    }
                }, (beregnetTid / 500)*forsinkelsesparameter);
            }
        }

        if (erFerdigLastet && element && bredde + 7 < 100) {
            setTimeout(() => {
                element.style.width = (bredde + 7).toString() + '%';
                setBredde(bredde + 7);
            }, 100);
        }
    }

    if (erFerdigLastet && tid>beregnetTid) {
        setSkalvises(false);
    }

    const tekst = Math.floor(bredde).toString() + '%';
    const overtekst = antall>0 ? antall : '';

    return (
        <div className={'progressbar__container'}>
            <Ingress className={'progressbar__henter-antall'}>{'Henter ' + overtekst + ' arbeidsforhold'}</Ingress>
            <div className={'progressbar__prosent'}>{tekst}</div>
            <div className="progressbar">
                <div className={'progressbar__fyll'} id={'progressbar__fyll'} />
            </div>
        </div>
    );
};

export default Progressbar;
