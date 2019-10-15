import React, { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import loadingImg from '../images/loading.svg';
import { TRANSLATIONS } from '../translations/dictionary';
import { globalContext, setGlobalContext } from './context';
import { OPEN_MODAL } from './reducer';

export function Reset(): JSX.Element {
  const { global } = useContext(globalContext);
  const { setGlobal } = useContext(setGlobalContext);

  const [state, setState] = useState({ loading: false, emailError: '' });
  const txt = TRANSLATIONS[global.language];
  const email = useRef<HTMLInputElement>(null);
  const resetForm = useRef<HTMLFormElement>(null);

  const validateEmail = (emailArg: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailArg) return txt.emailIsRequired;
    if (!emailRegex.test(emailArg)) return txt.emailIsInvalid;
    return '';
  };

  useEffect(() => {
    if (resetForm.current) resetForm.current.reset();
    if (email.current) email.current.focus();
  }, [global]);

  const logIn = () => {
    setGlobal({ type: OPEN_MODAL, value: 'login' });
  };
  const reset = async (event: React.MouseEvent) => {
    event.preventDefault();
    setState({ ...state, loading: true });

    if (email.current) {
      const emailError = validateEmail(email.current.value);
      let loading = false;
      if (!emailError) {
        loading = true;
      }
      setState({ ...state, loading, emailError });
      setTimeout(() => {
        setState({ ...state, emailError: '' });
      }, 2200);
      if (loading) {
        const response = await fetch(`${global.apiUrl}/login/reset-password`, {
          body: JSON.stringify({ email: email.current.value }),
          headers: {
            // prettier-ignore
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        if (response.status === 200) {
          setGlobal({ type: OPEN_MODAL, value: 'sent' });
        }
      }
    }
  };
  return (
    <div>
      <h2>{txt.resetPassword}</h2>
      <h3>{txt.enterYourEmailToReset}</h3>
      <form ref={resetForm}>
        <label>Email</label>
        <input type='text' name='email' ref={email} />
        <CSSTransition
          in={!!state.emailError}
          appear={!!state.emailError}
          timeout={400}
          classNames='error'
        >
          <small className='error'>{state.emailError}</small>
        </CSSTransition>
        <button color='primary' onClick={reset}>
          {!state.loading ? (
            txt.resetPassword
          ) : (
            <img src={loadingImg} alt='loading' className='loading' />
          )}
        </button>
      </form>
      <p className='center'>
        {txt.justRemembered}?{' '}
        <b className='blue' onClick={logIn}>
          {txt.login}
        </b>
      </p>
    </div>
  );
}
