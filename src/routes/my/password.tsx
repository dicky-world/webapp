import React, { useContext, useState } from 'react';
import { Error } from '../../components/error';
import { Global } from '../../globalState';
import { Dispatch, SET_MODAL, SET_SHARED } from '../../globalState';
import loadingImg from '../../images/loading.svg';

const Password: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const [state, setState] = useState({
    apiError: '',
    confirmPassword: '',
    confirmPasswordError: '',
    currentPassword: '',
    currentPasswordError: '',
    loading: false,
    newPassword: '',
    newPasswordError: '',
  });
  const {
    apiError,
    confirmPassword,
    confirmPasswordError,
    currentPassword,
    currentPasswordError,
    newPassword,
    newPasswordError,
  } = state;

  const forgottenPassword = () => {
    dispatch({ type: SET_MODAL, value: 'forgot' });
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    event.persist();
    const { name, value } = event.target;
    if (name === 'currentPassword' && currentPasswordError) {
      validate('currentPassword', currentPassword);
    }
    if (name === 'newPassword' && newPasswordError) {
      validate('newPassword', newPassword);
    }
    if (name === 'confirmPassword' && confirmPasswordError) {
      validate('confirmPassword', confirmPassword);
    }
    setState((prev) => ({ ...prev, [name]: value }));
  };

  interface PropsInterface {
    currentPassword: string;
    newPassword: string;
  }
  const callApi = async (props: PropsInterface) => {
    setState((prev) => ({ ...prev, loading: true }));
    const response = await fetch(`${global.env.apiUrl}/my/password`, {
      body: JSON.stringify({
        currentPassword: props.currentPassword,
        jwtToken: localStorage.getItem('jwtToken'),
        newPassword: props.newPassword,
      }),
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const content = await response.json();
    setState((prev) => ({ ...prev, loading: false, apiError: '' }));
    if (response.status === 200) {
      localStorage.setItem('jwtToken', content.jwtToken);
      dispatch({ type: SET_SHARED, value: content.shared });
      setState((prev) => ({
        ...prev,
        confirmPassword: '',
        currentPassword: '',
        newPassword: '',
      }));
    } else {
      setState((prev) => ({ ...prev, apiError: content.error }));
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const confirmPasswordValidation = validate(
      'confirmPassword',
      confirmPassword
    );
    const currentPasswordValidation = validate(
      'currentPassword',
      currentPassword
    );
    const newPasswordValidation = validate('newPassword', newPassword);

    if (
      confirmPasswordValidation &&
      currentPasswordValidation &&
      newPasswordValidation
    ) {
      if (newPassword === confirmPassword) {
        callApi({ currentPassword, newPassword });
      } else {
        setState((prev) => ({
          ...prev,
          confirmPasswordError: 'Passwords are not the same',
        }));
      }
    }
  };

  const onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    validate(event.target.name, event.target.value);
  };

  const validate = (name: string, password: string) => {
    if (
      name === 'confirmPassword' ||
      name === 'currentPassword' ||
      name === 'newPassword'
    ) {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
          password
        )
      ) {
        setState((prev) => ({
          ...prev,
          [name +
          'Error']: '8+ charectors, and include 1: number, uppercase & special charector',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, [name + 'Error']: '' }));
        return true;
      }
    }
  };

  return (
    <span className='page'>
      <form onSubmit={onSubmit} className='form'>
        <h4 className='form--title'>Change Password</h4>
        <div className='form--body'>
          <div>Password</div>
          <div className='form--relative'>
            {apiError && <div className='error--api'>{apiError}</div>}

            <label>
              Current Password
              <input
                autoFocus
                className={currentPasswordError && 'form--error'}
                maxLength={70}
                name='currentPassword'
                onBlur={onBlur}
                onChange={onChange}
                type='password'
                value={currentPassword}
              />
              <Error error={currentPasswordError} />
            </label>

            <small onClick={forgottenPassword}>Forgot your password?</small>

            <label>
              New Password
              <input
                className={newPasswordError && 'form--error'}
                maxLength={70}
                name='newPassword'
                onBlur={onBlur}
                onChange={onChange}
                type='password'
                value={newPassword}
              />
              <Error error={newPasswordError} />
            </label>

            <label>
              Confirm Password
              <input
                className={confirmPasswordError && 'form--error'}
                maxLength={70}
                name='confirmPassword'
                onBlur={onBlur}
                onChange={onChange}
                type='password'
                value={confirmPassword}
              />
              <Error error={confirmPasswordError} />
            </label>
          </div>
        </div>
        <div className='form--footer'>
          <small></small>
          <div>
            <button color='primary'>
              {!state.loading ? (
                'Save Changes'
              ) : (
                <img src={loadingImg} alt='loading' className='loading' />
              )}
            </button>
          </div>
        </div>
      </form>
    </span>
  );
};

export { Password };
