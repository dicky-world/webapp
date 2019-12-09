import React, { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Dispatch, SET_MODAL } from '../globalState';
import { Forgot } from './forgot';
import { Join } from './join';
import { Login } from './login';
import { Resetpassword } from './resetpassword';
import { Resetsent } from './resetsent';

interface PropsInterface {
  screen: string;
}

const Modal: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { dispatch } = useContext(Dispatch);
  const preventDefault = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  const determineScreen = () => {
    if (props.screen === 'join') {
      return (
        <div className='modal--modalCard' onClick={preventDefault}>
          <Join />
        </div>
      );
    }
    if (props.screen === 'login') {
      return (
        <div className='modal--modalCard' onClick={preventDefault}>
          <Login />
        </div>
      );
    }
    if (props.screen === 'forgot') {
      return (
        <div className='modal--modalCard' onClick={preventDefault}>
          <Forgot />
        </div>
      );
    }
    if (props.screen === 'resetsent') {
      return (
        <div className='modal--modalCard' onClick={preventDefault}>
          <Resetsent />
        </div>
      );
    }
    if (props.screen === 'resetpassword') {
      return (
        <div className='modal--modalCard' onClick={preventDefault}>
          <Resetpassword />
        </div>
      );
    }
  };
  const screen = determineScreen();

  const closeModal = () => {
    dispatch({ type: SET_MODAL, value: '' });
  };

  return (
    <CSSTransition
      in={!!props.screen}
      timeout={300}
      unmountOnExit
      classNames='modal'
    >
      <div className='modal' onClick={closeModal}>
        {screen}
      </div>
    </CSSTransition>
  );
};

export { Modal };
