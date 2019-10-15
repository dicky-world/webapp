import React, { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import loadingImg from '../images/loading.svg';
import { TRANSLATIONS } from '../translations/dictionary';
import { globalContext, setGlobalContext } from './context';
import { LOGGED_IN, OPEN_MODAL } from './reducer';

export function Login(): JSX.Element {
  const { global } = useContext(globalContext);
  const { setGlobal } = useContext(setGlobalContext);
  const [state, setState] = useState({
    emailError: '',
    loading: false,
    passwordError: '',
  });
  const txt = TRANSLATIONS[global.language];
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const loginForm = useRef<HTMLFormElement>(null);

  const validateEmail = (emailArg: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailArg) return txt.emailIsRequired;
    if (!emailRegex.test(emailArg)) return txt.emailIsInvalid;
    return '';
  };

  const validatePassword = (passwordArg: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?:.{6,})$/;
    if (!passwordArg) return txt.passwordIsRequired;
    if (!passwordRegex.test(passwordArg)) return txt.passwordLength;
    return '';
  };

  useEffect(() => {
    if (loginForm.current) loginForm.current.reset();
    if (email.current) email.current.focus();
  }, [global, setGlobal]);

  const join = () => setGlobal({ type: OPEN_MODAL, value: 'join' });
  const reset = () => setGlobal({ type: OPEN_MODAL, value: 'reset' });

  const login = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (email.current && password.current) {
      const emailError = validateEmail(email.current.value);
      const passwordError = validatePassword(password.current.value);
      let loading = false;
      if (!emailError && !passwordError) {
        loading = true;
      }
      setState({ ...state, loading, emailError, passwordError });
      setTimeout(() => {
        setState({ ...state, emailError: '', passwordError: '' });
      }, 2200);
      if (loading) {
        const response = await fetch(`${global.apiUrl}/login`, {
          body: JSON.stringify({
            email: email.current.value,
            password: password.current.value,
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
          let warningMessage = '';
          if (!content.emailConfirmed) {
            warningMessage = 'confirm';
            localStorage.setItem('warning', 'confirm');
          }
          localStorage.setItem('jwtToken', content.jwtToken);
          localStorage.setItem('fullName', content.fullName);
          setState({
            ...state,
            emailError: '',
            loading: false,
            passwordError: '',
          });
          setGlobal({
            type: LOGGED_IN,
            value: { name: content.fullName, warning: warningMessage },
          });
        } else {
          setState({
            ...state,
            emailError: content.message || content[0].message,
          });
        }
      }
    }
  };

  return (
    <div>
      <h2>{txt.logIn}</h2>
      <h3>
        {txt.welcomeBackTo} <span className='blue'>{txt.siteName}</span>
      </h3>
      <form ref={loginForm}>
        <label>{txt.email}</label>
        <input type='text' name='email' ref={email} />
        <CSSTransition
          in={!!state.emailError}
          appear={!!state.emailError}
          timeout={400}
          classNames='error'
        >
          <small className='error'>{state.emailError}</small>
        </CSSTransition>

        <label>{txt.password}</label>
        <input type='password' name='password' ref={password} />
        <CSSTransition
          in={!!state.passwordError}
          appear={!!state.passwordError}
          timeout={400}
          classNames='error'
        >
          <small className='error'>{state.passwordError}</small>
        </CSSTransition>

        <b className='right blue' onClick={reset}>
          {txt.forgotPassword}?
        </b>

        <button color='primary' onClick={login}>
          {!state.loading ? (
            txt.login
          ) : (
            <img src={loadingImg} alt='loading' className='loading' />
          )}
        </button>
      </form>
      <p className='center'>
        {txt.dontHaveAnAccount}?
        <b className='blue' onClick={join}>
          {txt.join} {txt.siteName}
        </b>
      </p>
    </div>
  );
}
