import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch, SET_MODAL } from '../globalState';

interface ConfirmProps extends RouteComponentProps<{ resetPassword: string }> {}

const ResetPassword: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { dispatch } = useContext(Dispatch);

  const resetPassword = props.match.params.resetPassword;
  localStorage.setItem('resetCode', resetPassword);
  useEffect(() => {
    dispatch({ type: SET_MODAL, value: 'resetpassword' });
  }, [dispatch]);

  return <div className='page'></div>;
};

export { ResetPassword };
