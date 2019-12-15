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
        <Link to={{ pathname: '/my/password' }}>
          <div
            className={`side-nav--item ${second === 'password' &&
              'side-nav--selected'}`}
          >
            Password
          </div>
        </Link>
      </aside>
    </div>
  );
};

export { SideNav };
