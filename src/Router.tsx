import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Context } from "./components/context";
import { Layout } from "./components/layout";
import { Home } from './routes/home';
import { Face } from './routes/face';
import { NotFound } from './routes/not-found';


const Router: React.FC = () => {

  const [global, setGlobal] = useState({
    language: 'en',
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches || false,
    apiUrl: 'http://127.0.0.1:9990',
    warning: localStorage.getItem("warning") ? true : false,
    warningMessage: localStorage.getItem("warning"),
    modal: false,
    modalState: '',
    loggedIn: localStorage.getItem("jwtToken") ? true : false,
    fullName: localStorage.getItem("fullName") || '',
  });

  return (
    <Context.Provider value={{ global, setGlobal }}>
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
    </Context.Provider>
  );
}

export { Router };
