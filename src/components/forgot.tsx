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

  const { apiError, email, emailError, passwordError } = state;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    if (event.target.id === 'email' && state.emailError) validate('email');
    if (event.target.id === 'password' && state.passwordError) {
      validate('password');
    }
    setState((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  interface PropsInterface {
    email: string;
  }

  const callApi = async (props: PropsInterface) => {
    if (props.email) {
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
      callApi({
        email: state.email,
      });
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
          type='text'
          placeholder='Email address'
          id='email'
          value={email}
          onChange={onChange}
          onBlur={onBlur}
          className={emailError && 'forgot--error'}
        />
        <Error error={emailError} />
        <small className='forgot--right' onClick={justRemembered}>
          Just Remebered?
        </small>
        <Error error={passwordError} />
        <button color='primary'>
          {!state.loading ? (
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
