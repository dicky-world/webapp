import React, { useContext, useRef, useEffect, useState } from 'react';
import { setGlobalContext, globalContext  } from "./context";
import { Translations } from '../translations/dictionary';
import loading from '../images/loading.svg';
import { CSSTransition } from 'react-transition-group'
import { OPEN_MODAL } from './reducer';

const Reset: React.FC = () => {
  const { global } = useContext(globalContext) as {global: any};
  const { setGlobal } = useContext(setGlobalContext) as {setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const [state, setState] = useState({loading: false, emailError: ''});
  const txt = Translations[global.language];
  const email = useRef<HTMLInputElement>(null);
  const resetForm = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) return txt.emailIsRequired;
    if (!emailRegex.test(email)) return txt.emailIsInvalid; 
    return ''; 
  }

  useEffect(() => {
    if (resetForm.current) resetForm.current.reset();
    if (email.current) email.current.focus();
  }, [global]);

  const logIn = () => {
    setGlobal({type: OPEN_MODAL, value: 'login'});
  }
  const reset = async(event: any) => {
    event.preventDefault();
    setState({...state, loading: true});

    if (email.current) {
    const emailError = validateEmail(email.current.value);
    let loading = false;
    if (!emailError) {
      loading = true;
    }
    setState({...state, loading, emailError});
    setTimeout(() => {
      setState({...state, emailError: ''});
     }, 2200);
    if (loading === true) {
      const response = await fetch(`${global.apiUrl}/login/reset-password`, {
        method: 'POST',
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({email: email.current.value})
      });
      if (response.status === 200) {
        setGlobal({type: OPEN_MODAL, value: 'sent'});
      }
    }
  }

  }
  return (    
    <div>
      <h2>{txt.resetPassword}</h2>
        <h3>{txt.enterYourEmailToReset}</h3>
        <form ref={resetForm}>
          <label>Email</label>
          <input type="text" name="email" ref={email}/>
          <CSSTransition in={state.emailError ? true : false} appear={state.emailError ? true : false} timeout={400} classNames='error'>
            <small className='error'>{state.emailError}</small>
          </CSSTransition>
          <button color='primary' onClick={reset}>
            {!state.loading ? txt.resetPassword : <img src={loading} alt="loading" className='loading'/>}
          </button>
        </form>
        <p className='center'>{txt.justRemembered}? <b className='blue' onClick={logIn}>{txt.login}</b></p>   
    </div>
  );
}

export { Reset };
