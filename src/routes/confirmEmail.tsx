import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';

interface ConfirmProps
  extends RouteComponentProps<{ confirmationCode: string }> {}

const ConfirmEmail: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const confirmationCode = props.match.params.confirmationCode;

  const [state, setState] = useState({
    apiError: '',
  });

  const { apiError } = state;
  useEffect(() => {
    async function checkConfirmationCode() {
      const response = await fetch(`${global.env.apiUrl}/join/confirm-email`, {
        body: JSON.stringify({ confirmationCode }),
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
        localStorage.setItem('shared', JSON.stringify(content.shared));
        dispatch({ type: SET_SHARED, value: content.shared });
        props.history.push('/my/profile');
      } else {
        setState((prev) => ({ ...prev, apiError: content.error }));
      }
    }
    if (confirmationCode) {
      checkConfirmationCode();
    }
  }, [confirmationCode, dispatch, global.env.apiUrl, props.history]);

  return (
    <div className='page'>
      {apiError && <div className='error--api'>{apiError}</div>}
    </div>
  );
};

export { ConfirmEmail };
