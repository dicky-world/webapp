import React from 'react';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';

interface PropsInterface {
  location: RouteProps['location'];
}

const SideNav: React.FC<PropsInterface> = (props: PropsInterface) => {
  const second = props.location ? props.location.pathname.split('/')[2] : '';

  return (
    <div>
      <aside className='side-nav'>
        <Link to={{ pathname: '/my/profile' }}>
          <div
            className={`side-nav--item ${second === 'profile' &&
              'side-nav--selected'}`}
          >
            Edit Profile
          </div>
        </Link>
        <Link to={{ pathname: '/my/preferences' }}>
          <div
            className={`side-nav--item ${second === 'preferences' &&
              'side-nav--selected'}`}
          >
            Preferences
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
        <Link to={{ pathname: '/my/verification' }}>
          <div
            className={`side-nav--item ${second === 'verification' &&
              'side-nav--selected'}`}
          >
            Verification
          </div>
        </Link>

      </aside>
    </div>
  );
};

export { SideNav };
