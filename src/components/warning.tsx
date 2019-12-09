import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED, WARNING_MESSAGE } from '../globalState';

interface PropsInterface {
  message: string;
}

const Warning: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const callApi = async () => {
    dispatch({ type: WARNING_MESSAGE, value: 'sent' });
    const response = await fetch(`${global.env.apiUrl}/join/resend-email`, {
      body: JSON.stringify({
        jwtToken: localStorage.getItem('jwtToken'),
      }),
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const content = await response.json();
    if (response.status === 200) {
      localStorage.setItem('jwtToken', content.jwtToken);
      dispatch({ type: SET_SHARED, value: content.shared });
      setTimeout(() => {
        dispatch({ type: WARNING_MESSAGE, value: 'verify' });
       }, 2000);
    } else {
      // TODO: Display error to front end and style
      console.log(content.error);
    }
  };

  const getMessage = (messageKey: string) => {
    if (messageKey === 'verify') {
      return (
        <div>
          Please confirm your email address. If you haven't received anything
          you can{' '}
          <b>
            <Link to={{ pathname: '/my/profile' }}>update your email</Link>
          </b>
          {' '} or <b onClick={callApi}>resend confirmation</b>.
        </div>
      );
    }
    if (messageKey === 'offline') return <div>offline</div>;
    if (messageKey === 'sent') return <div>Email sent!</div>;
  };

  const displayText = getMessage(props.message);

  return (
    <CSSTransition
      in={!!props.message}
      timeout={300}
      unmountOnExit
      classNames='warning'
    >
      <div className='warning'>
        <TransitionGroup>
          <CSSTransition
            key={props.message || ''}
            timeout={300}
            classNames='warning-text'
          >
            <div className='warning-text'>{displayText}</div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </CSSTransition>
  );
};

export { Warning };
