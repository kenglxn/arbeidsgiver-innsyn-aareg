import React, {FunctionComponent} from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';

import { Route} from 'react-router';
import InformasjonOmBedriftOgAnsatte from "./InformasjonOmBedriftOgAnsatte/InformasjonOmBedriftOgAnsatte";
import { basename } from './paths';

const App: FunctionComponent = () => {


  return (
      <div className="typo-normal">
          <div
          >helloo</div>
        <BrowserRouter basename={basename}>
          <div>
              <div className="bakgrunnsside">
                          <Route
                              path="/bedriftoversikt-og-ansatte"
                              exact={true}
                              component={InformasjonOmBedriftOgAnsatte}
                          />
              </div>
          </div>
        </BrowserRouter>
      </div>
  );
};

export default App;
