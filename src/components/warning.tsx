import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TRANSLATIONS } from '../translations/dictionary';
import { globalContext, setGlobalContext } from './context';
import { OPEN_WARNING } from './reducer';

export function Warning(): JSX.Element {
  const { global } = useContext(globalContext);
  const { setGlobal } = useContext(setGlobalContext);
  const txt = TRANSLATIONS[global.language];

  const resend = async () => {
    setGlobal({ type: OPEN_WARNING, value: 'sent' });
    const jwtToken = localStorage.getItem('jwtToken');
    const response = await fetch(`${global.apiUrl}/register/resend-email`, {
      body: JSON.stringify({ jwtToken }),
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    if (response.status === 200) {
      setTimeout(() => {
        setGlobal({ type: OPEN_WARNING, value: 'confirm' });
      }, 3000);
    }
  };
  return (
    <div className='layout-root'>
      <TransitionGroup>
        <CSSTransition
          key={global.warningMessage || ''}
          timeout={600}
          classNames='warningtext'
        >
          <div className='warning-text'>
            {global.warningMessage === 'confirm' && (
              <p>
                <span>{txt.pleaseConfirmYourEmail}</span>
                <Link to={{ pathname: '/my/profile' }}>
                  <b>{txt.updateYourEmail}</b>
                </Link>
                {txt.or}
                <b onClick={resend}>{txt.resendConfirmation}</b>
              </p>
            )}
            {global.warningMessage === 'sent' && <p>{txt.emailSent}</p>}
            {global.warningMessage === 'invalid' && <p>{txt.invalid}</p>}
            {global.warningMessage === 'confirmed' && <p>{txt.confirmed}</p>}
            {global.warningMessage === 'offline' && <p>{txt.offline}</p>}
            {global.warningMessage === 'online' && <p>{txt.online}</p>}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}
