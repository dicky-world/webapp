import React, { useReducer } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { setGlobalContext, globalContext } from "./components/context";
import { Layout } from "./components/layout";
import { Home } from './routes/home';
import { Face } from './routes/face';
import { NotFound } from './routes/not-found';

import { globalReducer } from './components/reducer'

const Router: React.FC = () => {
  
  const [global, setGlobal] = useReducer(globalReducer, {
    language: 'en',
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches || false,
    apiUrl: 'https://api.dicky.world',
    warning: localStorage.getItem("warning") ? true : false,
    warningMessage: localStorage.getItem("warning"),
    modal: false,
    modalState: '',
    loggedIn: localStorage.getItem("jwtToken") ? true : false,
    fullName: localStorage.getItem("fullName") || '',
  });


  return (
    <setGlobalContext.Provider value={{ setGlobal }}>
      <globalContext.Provider value={{ global }}>
        <BrowserRouter>
          <Route render={({ location }) => (
            <Layout location={ location }>
              <Switch location={ location }>
                <Route exact path = '/' component = { Home } />
                <Route exact path = '/my/profile/' component = { Home } />
                <Route exact path = '/my/face/' component = { Face } />
                <Route component = { NotFound }/>
              </Switch>
            </Layout>
          )} />
        </BrowserRouter>
      </globalContext.Provider>
    </setGlobalContext.Provider>
  );
}

export { Router };
