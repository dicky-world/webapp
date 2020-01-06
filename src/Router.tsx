import React, { useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from './components/layout';
import { Dispatch, Global, InitialState, Reducer } from './globalState';
import { Bus } from './routes/bus';
import { ConfirmEmail } from './routes/confirmEmail';
import { Home } from './routes/home';
import { Password } from './routes/my/password';
import { Photos } from './routes/my/photos';
import { Preferences } from './routes/my/preferences';
import { Profile } from './routes/my/profile';
import { Settings } from './routes/my/settings';
import { Verification } from './routes/my/verification';
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
                  <Route exact path='/add/photos' component={Photos} />
                  <Route exact path='/my/profile' component={Settings} />
                  <Route exact path='/my/password' component={Password} />
                  <Route exact path='/my/preferences' component={Preferences} />
                  <Route exact path='/my/verification' component={Verification} />
                  <Route exact path='/bus/:id' component={Bus} />
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
