import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../translations/dictionary';
import { globalContext, setGlobalContext } from './context';
import { OPEN_MODAL } from './reducer';

export function TopNav(): JSX.Element {
  const { global } = useContext(globalContext);
  const { setGlobal } = useContext(setGlobalContext);

  const txt = TRANSLATIONS[global.language];

  const openModal = (event: React.MouseEvent) => {
    setGlobal({ type: OPEN_MODAL, value: (event.target as HTMLDivElement).id });
  };

  return (
    <div className='topNav'>
      <div>
        <Link to={{ pathname: '/' }}>
          <h1 className='logo'>{txt.siteName}</h1>
        </Link>
      </div>
      <div />
      {!global.loggedIn && (
        <div>
          <div className='buttons-desktop'>
            <div onClick={openModal} id='join'>
              <button className='joinButton'>
                {txt.join} <span className='siteName'>{txt.siteName}</span>
              </button>
            </div>
            <div onClick={openModal} id='login'>
              <button className='loginButton'>{txt.login}</button>
            </div>
          </div>
          <div className='buttons-mobile'>
            <div>
              <Link to={{ pathname: '/join' }}>
                <button className='joinButton'>
                  {txt.join} <span className='siteName'>{txt.siteName}</span>
                </button>
              </Link>
            </div>
            <div>
              <Link to={{ pathname: '/login' }}>
                <button className='loginButton'>{txt.login}</button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {global.loggedIn && <div>{global.fullName}</div>}
    </div>
  );
}
