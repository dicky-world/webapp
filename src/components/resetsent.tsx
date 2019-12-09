import React, { useContext } from 'react';
import { Dispatch, SET_MODAL } from '../globalState';

const Resetsent: React.FC = () => {
  const { dispatch } = useContext(Dispatch);

  setTimeout(() => {
    dispatch({ type: SET_MODAL, value: '' });
  }, 3000);

  return (
    <div className='forgot'>
      <h2>Sent</h2>
      <h3>
        We will send a password reset link if this email is associated with an
        account.
      </h3>
    </div>
  );
};

export { Resetsent };
