import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';
import loadingImg from '../images/loading.svg';
import { Error } from './error';

const Join: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const [state, setState] = useState({
    apiError: '',
    email: '',
    emailError: '',
    fullName: '',
    fullNameError: '',
    loading: false,
    password: '',
    passwordError: '',
  });

  const {
    apiError,
    email,
    emailError,
    fullName,
    fullNameError,
    loading,
    password,
    passwordError,
  } = state;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const { id, value } = event.target;
    if (id === 'email' && emailError) validate('email');
    if (id === 'fullName' && fullNameError) {
      validate('fullName');
    }
    if (id === 'password' && passwordError) {
      validate('password');
    }
    setState((prev) => ({ ...prev, [id]: value }));
  };

  interface PropsInterface {
    fullName: string;
    email: string;
    password: string;
  }

  const callApi = async (props: PropsInterface) => {
    if (props.fullName && props.email && props.password) {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await fetch(`${global.env.apiUrl}/join`, {
        body: JSON.stringify({
          email: props.email,
          fullName: props.fullName,
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
      setState((prev) => ({ ...prev, loading: false }));
      if (response.status === 200) {
        localStorage.setItem('jwtToken', content.jwtToken);
        dispatch({ type: SET_SHARED, value: content.shared });
        window.location.href = '/my/profile';
      } else {
        setState((prev) => ({ ...prev, apiError: content.error }));
      }
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const fullNameValidation = validate('fullName');
    const emailValidation = validate('email');
    const passwordValidation = validate('password');
    if (fullNameValidation && emailValidation && passwordValidation) {
      callApi({
        email: state.email,
        fullName: state.fullName,
        password: state.password,
      });
    }
  };

  const onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    validate(event.target.id);
  };

  const validate = (id: string) => {
    if (id === 'fullName') {
      if (!/^.{2,}$/.test(fullName)) {
        setState((prev) => ({
          ...prev,
          fullNameError: '2 charectors or longer',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, fullNameError: '' }));
        return true;
      }
    }
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
  };

  return (
    <div className='join'>
      <h2>JOIN</h2>
      <h3>some subheading</h3>
      <form onSubmit={onSubmit}>
        {apiError && <div className='error--api'>{apiError}</div>}
        <label>Name</label>
        <input
          className={fullNameError && 'join--error'}
          id='fullName'
          maxLength={70}
          onBlur={onBlur}
          onChange={onChange}
          placeholder='Full name'
          type='text'
          value={fullName}
        />
        <Error error={fullNameError} />

        <label>Email</label>
        <input
          className={emailError && 'join--error'}
          id='email'
          maxLength={320}
          onBlur={onBlur}
          onChange={onChange}
          placeholder='Email address'
          type='text'
          value={email}
        />
        <Error error={emailError} />
        <label>Password</label>
        <input
          className={passwordError && 'join--error'}
          id='password'
          maxLength={70}
          onBlur={onBlur}
          onChange={onChange}
          placeholder='Create a password'
          type='password'
          value={password}
        />
        <Error error={passwordError} />
        <button color='primary'>
          {!loading ? (
            'Join Now'
          ) : (
            <img src={loadingImg} alt='loading' className='loading' />
          )}
        </button>
        <div className='join--terms'>
          By joining, you agree to our
          <Link to={{ pathname: '/terms' }}> Terms of Service</Link> and
          <Link to={{ pathname: '/terms' }}> Privacy Policy</Link>
        </div>
      </form>
    </div>
  );
};

export { Join };
