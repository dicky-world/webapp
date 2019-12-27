import React, { ChangeEvent, useContext, useState } from 'react';
import { Global } from '../globalState';
import { Dispatch, SET_MODAL, SET_SHARED } from '../globalState';
import loadingImg from '../images/loading.svg';
import { Error } from './error';

const Login: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const [state, setState] = useState({
    apiError: '',
    email: '',
    emailError: '',
    formattedToken: '',
    formattedTokenError: '',
    loading: false,
    password: '',
    passwordError: '',
    twoFactor: false,
  });

  const {
    apiError,
    email,
    emailError,
    formattedToken,
    formattedTokenError,
    loading,
    password,
    passwordError,
    twoFactor,
  } = state;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const { id, value } = event.target;
    if (id === 'email' && state.emailError) validate('email');
    if (id === 'password' && state.passwordError) {
      validate('password');
    }
    setState((prev) => ({ ...prev, [id]: value }));
  };

  interface PropsInterface {
    email: string;
    password: string;
    formattedToken: string;
  }

  const callApi = async (props: PropsInterface) => {
    if (props.email && props.password) {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await fetch(`${global.env.apiUrl}/login`, {
        body: JSON.stringify({
          email: props.email,
          formattedToken: props.formattedToken,
          password: props.password,
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
        if (!content.twoFactor) {
          localStorage.setItem('jwtToken', content.jwtToken);
          dispatch({ type: SET_SHARED, value: content.shared });
          setState((prev) => ({ ...prev, loading: false }));
        }
        if (content.twoFactor) {
          setState((prev) => ({ ...prev, loading: false, twoFactor: true }));
        }
      } else {
        setState((prev) => ({ ...prev, apiError: content.error, loading: false }));
      }
    }
  };

  const forgottenPassword = () => {
    dispatch({ type: SET_MODAL, value: 'forgot' });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const emailValidation = validate('email');
    const passwordValidation = validate('password');
    const formattedTokenValidation = validate('formattedToken');
    if (emailValidation && passwordValidation && formattedTokenValidation) {
      callApi({ email, password, formattedToken });
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
    if (id === 'password') {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
          password
        )
      ) {
        setState((prev) => ({
          ...prev,
          passwordError:
            'Your password must contain at least eight letters, and include a number and an uppercase letter',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, passwordError: '' }));
        return true;
      }
    }
    if (id === 'formattedToken') {
      if (formattedToken.length === 0 || formattedToken.length === 6) {
        setState((prev) => ({ ...prev, formattedTokenError: '' }));
        return true;
      } else {
        setState((prev) => ({ ...prev, formattedTokenError: 'Must be six charectors' }));
        return false;
      }
    }
  };

  return (
    <div className='login'>
      <h2>Login</h2>
      <h3>welcome back</h3>
      <form onSubmit={onSubmit}>
        {apiError && <div className='error--api'>{apiError}</div>}
        <label>Email</label>
        <input
          autoFocus
          className={emailError && 'login--error'}
          id='email'
          onBlur={onBlur}
          onChange={onChange}
          placeholder='Email address'
          type='text'
          value={email}
        />
        <Error error={emailError} />
        <label>Password</label>
        <input
          className={passwordError && 'login--error'}
          id='password'
          onBlur={onBlur}
          onChange={onChange}
          placeholder='Create a password'
          type='password'
          value={password}
        />
        <small className='login--right' onClick={forgottenPassword}>
          Forgotten Password?
        </small>
        <Error error={passwordError} />
        {twoFactor && (
          <span>
            <label>Two factor authentication</label>
            <input
              autoFocus
              id='formattedToken'
              onBlur={onBlur}
              onChange={onChange}
              placeholder='Six digit code'
              type='password'
              value={formattedToken}
            />
            <Error error={formattedTokenError} />
          </span>
        )}
        <button color='primary'>
          {!loading ? (
            'Login'
          ) : (
            <img src={loadingImg} alt='loadingd' className='loading' />
          )}
        </button>
      </form>
    </div>
  );
};

export { Login };
