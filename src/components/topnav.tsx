import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Dispatch, SET_MODAL } from '../globalState';

interface PropsInterface {
  avatar: string;
  loggedIn: boolean;
  fullName: string;
}

const TopNav: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { dispatch } = useContext(Dispatch);
  const firstName = props.fullName.split(' ')[0];
  const initial = firstName.charAt(0);
  const imagePath = props.avatar
    ? props.avatar
    : `/icons/initial/${initial}.png`;

  const login = () => {
    dispatch({ type: SET_MODAL, value: 'login' });
  };

  const join = () => {
    dispatch({ type: SET_MODAL, value: 'join' });
  };

  const determineButtons = () => {
    if (props.loggedIn) {
      return (
        <div className='topnav--buttons'>
          <Link to={{ pathname: '/my/profile' }}>
            <div className='topnav--avatar'>
              <img src={imagePath} alt='your first name initial' />
              <div>{firstName}</div>
            </div>
          </Link>
        </div>
      );
    }
    if (!props.loggedIn) {
      return (
        <div className='topnav--buttons'>
          <button color='primary' onClick={join}>
            Join Site
          </button>
          <button color='secondary' onClick={login}>
            Login
          </button>
        </div>
      );
    }
  };

  const buttons = determineButtons();

  return (
    <nav className='topnav'>
      <div className='topnav--container'>
        <div className='topnav--logo'>
          <Link to='/'>Logo</Link>
        </div>
        <div className='topnav--search'></div>
        {buttons}
      </div>
    </nav>
  );
};

export { TopNav };
