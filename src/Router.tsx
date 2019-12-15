import React, { useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from './components/layout';
import { Dispatch, Global, InitialState, Reducer } from './globalState';
import { ConfirmEmail } from './routes/confirmEmail';
import { Home } from './routes/home';
import { Password } from './routes/my/password';
import { Profile } from './routes/my/profile';
import { Settings } from './routes/my/settings';
import { NotFound } from './routes/notFound';
import { ResetPassword } from './routes/resetPassword';

const Router: React.FC = () => {
  const [global, dispatch] = useReducer(Reducer, InitialState);
  return (
    <Dispatch.Provider value={{ dispatch }}>
      <Global.Provider value={{ global }}>
        <BrowserRouter>
          <Route
            render={({ location }) => (
              <Layout location={location}>
                <Switch location={location}>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/my/profile' component={Settings} />
                  <Route exact path='/my/password' component={Password} />
                  <Route exact path='/confirm-email/:confirmationCode' component={ConfirmEmail} />
                  <Route exact path='/reset-password/:resetPassword' component={ResetPassword} />
                  <Route exact path='/:username' component={Profile} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            )}
          />
        </BrowserRouter>
      </Global.Provider>
    </Dispatch.Provider>
  );
};

export { Router };
