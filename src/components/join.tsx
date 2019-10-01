import React, { useContext, useRef, useEffect, useState } from 'react';
import { Context } from "./context";
import { Translations } from '../translations/dictionary';
import { Link } from 'react-router-dom';
import loading from '../images/loading.svg';
import { CSSTransition } from 'react-transition-group'

const Join: React.FC = () => {
  const { global, setGlobal } = useContext(Context) as {global: any; setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const [state, setState] = useState({loading: false, fullNameError: '', emailError: '', passwordError: ''});
  const txt = Translations[global.language];
  const fullName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const joinForm = useRef<HTMLFormElement>(null);

  const validateFullName = (fullName: string) => {
    if (!fullName) return txt.fullNameIsRequired;
    if (fullName.length > 35) return txt.fullNameIsTooLong;
    return '';
  }

  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) return txt.emailIsRequired;
    if (!emailRegex.test(email)) return txt.emailIsInvalid; 
    return ''; 
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?:.{6,})$/;
    if (!password) return txt.passwordIsRequired;
    if (!passwordRegex.test(password)) return txt.passwordLength;
    return '';
  }

  useEffect(() => {
    if (joinForm.current) joinForm.current.reset();
    if (fullName.current) fullName.current.focus();
  }, [global, setGlobal]);

  const close = () => setGlobal({...global, modal: false});
  const logIn = () => setGlobal({...global, modalState: 'login'});

  const join = async(event: any) => {
    event.preventDefault();
    if (fullName.current && email.current && password.current) {
      const fullNameError = validateFullName(fullName.current.value);
      const emailError = validateEmail(email.current.value);
      const passwordError = validatePassword(password.current.value);
      let loading = false
      if (!fullNameError && !emailError && !passwordError) loading = true;
      setState({...state, loading, fullNameError, emailError, passwordError});
      setTimeout(() => {
        setState({...state, fullNameError: '', emailError: '', passwordError: ''});
       }, 2200);
      if (loading === true) {
        const response = await fetch(`${global.apiUrl}/register`, {
          method: 'POST',
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          body: JSON.stringify({fullName: fullName.current.value, email: email.current.value, password: password.current.value})
        });
        const content = await response.json();
        if (response.status === 200) {
          localStorage.setItem("warning", 'confirm');
          localStorage.setItem("fullName", fullName.current.value);
          localStorage.setItem("jwtToken", content.jwtToken);
          setState({...state, loading: false, fullNameError: '', emailError: '', passwordError: ''});
          setGlobal({...global, modal: false, warning: true, warningMessage: 'confirm', loggedIn: true, fullName: fullName.current.value});
        } else {
          setState({...state, emailError: content.message || response.status});
        }
      }
    }
  }

  return (    
    <div>
        <h2>{txt.join}</h2>
        <h3>{txt.siteName} <span className='blue'>{txt.today}</span></h3>
        <form ref={joinForm}>
          
          <label>{txt.name}</label>
          <input type="text" ref={fullName}/>
          <CSSTransition in={state.fullNameError ? true : false} appear={state.fullNameError ? true : false} timeout={400} classNames='error'>
            <small className='error'>{state.fullNameError}</small>
          </CSSTransition>

          <label>{txt.email}</label>
          <input type="text" ref={email}/>
          <CSSTransition in={state.emailError ? true : false} appear={state.emailError ? true : false} timeout={400} classNames='error'>
            <small className='error'>{state.emailError}</small>
          </CSSTransition>


          <label>{txt.password}</label>
          <input type="password" ref={password}/>
          <CSSTransition in={state.passwordError ? true : false} appear={state.passwordError ? true : false} timeout={400} classNames='error'>
            <small className='error'>{state.passwordError}</small>
          </CSSTransition>

          <button color='primary' onClick={join}>
            {!state.loading ? txt.joinNow : <img src={loading} alt="loading" className='loading'/>}
          </button>

          <small>{txt.byJoiningYouAgreeToOur} <b onClick={close}><Link to={{pathname: '/terms'}}>{txt.termsOfService}</Link></b> {txt.and} <b onClick={close}><Link to={{pathname: '/privacy'}}>{txt.privacyPolicy}</Link></b></small>
        
        </form>
        <p className='center'>{txt.alreadyHaveAnAcocunt}? <b className='blue' onClick={logIn}>{txt.logIn}</b></p>        
    </div>
  );
}

export { Join };
