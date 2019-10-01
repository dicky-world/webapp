import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from "./context";
import { Translations } from '../translations/dictionary';
import loading from '../images/loading.svg';
import { CSSTransition } from 'react-transition-group'

const Login: React.FC = (props) => {
  const { global, setGlobal } = useContext(Context) as {global: any; setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const [state, setState] = useState({loading: false, emailError: '', passwordError: ''});
  const txt = Translations[global.language];
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const loginForm = useRef<HTMLFormElement>(null);

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
    if (loginForm.current) loginForm.current.reset();
    if (email.current) email.current.focus();
  }, [global, setGlobal]);

  const join = () => setGlobal({...global, modalState: 'join'});
  const reset = () => setGlobal({...global, modalState: 'reset'});
  
  const login = async(event: any) => {
    event.preventDefault();
    if (email.current && password.current) {
      const emailError = validateEmail(email.current.value);
      const passwordError = validatePassword(password.current.value);
      let loading = false;
      if (!emailError && !passwordError) {
        loading = true;
      }
      setState({...state, loading, emailError, passwordError});
      setTimeout(() => {
        setState({...state, emailError: '', passwordError: ''});
       }, 2200);
      if (loading === true) {
        const response = await fetch(`${global.apiUrl}/login`, {
          method: 'POST',
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          body: JSON.stringify({email: email.current.value, password: password.current.value})
        });
        const content = await response.json();
        if (response.status === 200) {
            let warning = false;
            let warningMessage = ''
            if (!content.emailConfirmed) {
              warning = true;
              warningMessage = 'confirm';
              localStorage.setItem('warning', 'confirm')
            }
            localStorage.setItem('jwtToken', content.jwtToken);
            localStorage.setItem('fullName', content.fullName);
            setState({...state, loading: false, emailError: '', passwordError: ''});
            setGlobal({...global, modal: false, warning, warningMessage, loggedIn: true, fullName: content.fullName});
        } else {
          setState({...state, emailError: content.message || content[0].message});
        }
      }
    }
  }

  return (    
    <div>
        <h2>{txt.logIn}</h2>
        <h3>{txt.welcomeBackTo} <span className='blue'>{txt.siteName}</span></h3>
        <form ref={loginForm}>
          
          <label>{txt.email}</label>
          <input type="text" name="email" ref={email}/>
          <CSSTransition in={state.emailError ? true : false} appear={state.emailError ? true : false} timeout={400} classNames='error'>
            <small className='error'>{state.emailError}</small>
          </CSSTransition>


          
          <label>{txt.password}</label>
          <input type="password" name="password" ref={password}/>
          <CSSTransition in={state.passwordError ? true : false} appear={state.passwordError ? true : false} timeout={400} classNames='error'>
            <small className='error'>{state.passwordError}</small>
          </CSSTransition>

          <b className='right blue' onClick={reset}>{txt.forgotPassword}?</b>
          
          <button color='primary' onClick={login}>
            {!state.loading ? txt.login : <img src={loading} alt="loading" className='loading'/>}
          </button>

        </form>
        <p className='center'>{txt.dontHaveAnAccount}? <b className='blue' onClick={join}>{txt.join} {txt.siteName}</b></p>    
    </div>
  );
}

export { Login };


