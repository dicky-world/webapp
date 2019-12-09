import React, { useContext } from 'react';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Dispatch, LOGGED_IN } from '../globalState';

interface PropsInterface {
  location: RouteProps['location'];
}

const SideNav: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { dispatch } = useContext(Dispatch);

  const logOut = () => {
    localStorage.clear();
    dispatch({ type: LOGGED_IN, value: false });
  };

  const second = props.location ? props.location.pathname.split('/')[2] : '';

  return (
    <div>
      <aside className='side-nav'>
        <Link to={{ pathname: '/my/profile' }}>
          <div
            className={`side-nav--item ${second === 'profile' &&
              'side-nav--selected'}`}
          >
            Profile
          </div>
        </Link>
        <Link to={{ pathname: '/my/password' }}>
          <div
            className={`side-nav--item ${second === 'password' &&
              'side-nav--selected'}`}
          >
            Password
          </div>
        </Link>
        <Link to={{ pathname: '/' }}>
          <div
            className={`side-nav--item ${second === 'logout' &&
              'side-nav--selected'}`}
            onClick={logOut}
          >
            Logout
          </div>
        </Link>
      </aside>
    </div>
  );
};

export { SideNav };
