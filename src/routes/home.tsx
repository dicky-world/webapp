import React, { useContext } from 'react';
import {
  Dispatch,
  LOGGED_IN,
  WARNING_MESSAGE,
} from '../globalState';

const Home: React.FC = () => {
  const { dispatch } = useContext(Dispatch);

  const login = () => {
    dispatch({ type: LOGGED_IN, value: true });
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: LOGGED_IN, value: false });
  };

  const openWarning = () => {
    dispatch({ type: WARNING_MESSAGE, value: 'verify' });
  };

  const closeWarning = () => {
    dispatch({ type: WARNING_MESSAGE, value: '' });
  };

  const warningMessageVerify = () => {
    dispatch({ type: WARNING_MESSAGE, value: 'verify' });
  };

  const warningMessageOffine = () => {
    dispatch({ type: WARNING_MESSAGE, value: 'offline' });
  };
  return (
    <section>
      {/* <button onClick={openWarning}>Open Warning</button><br/>
      <button onClick={closeWarning}>Close Warning</button><br/>
      <button onClick={warningMessageVerify}>Verify Email</button><br/>
      <button onClick={warningMessageOffine}>Offline</button><br/>
      <button onClick={login}>Log In</button><br/>
      <button onClick={logout}>Log Out</button><br/> */}
    </section>
  );
};

export { Home };
