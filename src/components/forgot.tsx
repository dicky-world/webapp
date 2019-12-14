import React, { ChangeEvent, useContext, useState } from 'react';
import { Global } from '../globalState';
import { Dispatch, SET_MODAL } from '../globalState';
import loadingImg from '../images/loading.svg';
import { Error } from './error';

const Forgot: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const [state, setState] = useState({
    apiError: '',
    email: '',
    emailError: '',
    loading: false,
    password: '',
    passwordError: '',
  });

  const { apiError, email, emailError, passwordError, loading } = state;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const { id, value } = event.target;
    if (id === 'email' && emailError) validate('email');
    if (id === 'password' && passwordError) {
      validate('password');
    }
    setState((prev) => ({ ...prev, [id]: value }));
  };

  interface PropsInterface {
    email: string;
  }

  const callApi = async (props: PropsInterface) => {
    if (props.email) {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await fetch(
        `${global.env.apiUrl}/login/reset-password`,
        {
          body: JSON.stringify({
            email: props.email,
          }),
          headers: {
            // prettier-ignore
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );
      const content = await response.json();
      if (response.status === 200) {
        dispatch({ type: SET_MODAL, value: 'resetsent' });
        setState((prev) => ({ ...prev, loading: false }));
      } else {
        setState((prev) => ({ ...prev, apiError: content.error }));
      }
    }
  };

  const justRemembered = () => {
    dispatch({ type: SET_MODAL, value: 'login' });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const emailValidation = validate('email');
    if (emailValidation) {
      callApi({ email });
    }
  };

  const onBlur = (event: ChangeEvent<HTMLInputElement>) => {
    validate(event.target.id);
  };

  const validate = (id: string) => {
    if (id === 'email') {
      if (!/\S+@\S+\.\S+/.test(email)) {
        setState((prev) => ({
          ...prev,
          emailError: 'A valid email address is required.',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, emailError: '' }));
        return true;
      }
    }
  };

  return (
    <div className='forgot'>
      <h2>Forgot password</h2>
      <h3>We will send you an email to reset your password.</h3>
      <form onSubmit={onSubmit}>
        {apiError && <div className='error--api'>{apiError}</div>}
        <label>Email</label>
        <input
          className={emailError && 'forgot--error'}
          id='email'
          onBlur={onBlur}
          onChange={onChange}
          placeholder='Email address'
          type='text'
          value={email}
        />
        <Error error={emailError} />
        <small className='forgot--right' onClick={justRemembered}>
          Just Remebered?
        </small>
        <Error error={passwordError} />
        <button color='primary'>
          {!loading ? (
            'Reset Password'
          ) : (
            <img src={loadingImg} alt='loadingd' className='loading' />
          )}
        </button>
      </form>
    </div>
  );
};

export { Forgot };
