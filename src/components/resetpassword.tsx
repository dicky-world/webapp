import React, { ChangeEvent, useContext, useState } from 'react';
import { Global } from '../globalState';
import { Dispatch, SET_MODAL, SET_SHARED } from '../globalState';
import loadingImg from '../images/loading.svg';
import { Error } from './error';

const Resetpassword: React.FC = () => {
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

  const { apiError, password, passwordError, loading } = state;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const { id, value } = event.target;
    if (id === 'password' && state.passwordError) {
      validate('password');
    }
    setState((prev) => ({ ...prev, [id]: value }));
  };

  interface PropsInterface {
    password: string;
  }

  const callApi = async (props: PropsInterface) => {
    if (props.password) {
      setState((prev) => ({ ...prev, loading: true }));
      const resetCode = localStorage.getItem('resetCode');
      const response = await fetch(
        `${global.env.apiUrl}/login/confirm-password`,
        {
          body: JSON.stringify({
            newPassword: props.password,
            resetCode,
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
        localStorage.removeItem('resetCode');
        localStorage.setItem('jwtToken', content.jwtToken);
        dispatch({ type: SET_SHARED, value: content.shared });
        dispatch({ type: SET_MODAL, value: '' });
        setState((prev) => ({ ...prev, loading: false }));
        window.location.href = '/my/profile';
      } else {
        setState((prev) => ({ ...prev, apiError: content.error }));
      }
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const passwordValidation = validate('password');
    if (passwordValidation) {
      callApi({
        password: state.password,
      });
    }
  };

  const onBlur = (event: ChangeEvent<HTMLInputElement>) => {
    validate(event.target.id);
  };

  const validate = (id: string) => {
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
  };

  return (
    <div className='login'>
      <h2>Reset password</h2>
      <h3>enter a new password</h3>
      <form onSubmit={onSubmit}>
        {apiError && <div className='error--api'>{apiError}</div>}
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
        <Error error={passwordError} />
        <button color='primary'>
          {!loading ? (
            'Save'
          ) : (
            <img src={loadingImg} alt='loadingd' className='loading' />
          )}
        </button>
      </form>
    </div>
  );
};

export { Resetpassword };
