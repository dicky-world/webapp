import React, { useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { globalContext, setGlobalContext } from './components/context';
import { Layout } from './components/layout';

import { AppState, globalReducer } from './components/reducer';
import { Face } from './routes/face';
import { Home } from './routes/home';
import { NotFound } from './routes/not-found';

const initialState: AppState = {
  apiUrl: 'https://api.dicky.world',
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches || false,
  fullName: localStorage.getItem('fullName') || '',
  language: 'en',
  loggedIn: !!localStorage.getItem('jwtToken'),
  modal: false,
  modalState: '',
  warning: !!localStorage.getItem('warning'),
  warningMessage: localStorage.getItem('warning'),
};

export function Router(): JSX.Element {
  const [global, setGlobal] = useReducer(globalReducer, initialState);

  return (
    <setGlobalContext.Provider value={{ setGlobal }}>
      <globalContext.Provider value={{ global }}>
        <BrowserRouter>
          <Route
            render={({ location }) => (
              <Layout location={location}>
                <Switch location={location}>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/my/profile/' component={Home} />
                  <Route exact path='/my/face/' component={Face} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            )}
          />
        </BrowserRouter>
      </globalContext.Provider>
    </setGlobalContext.Provider>
  );
}
