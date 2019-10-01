import React, { useContext } from 'react';
import { Context } from "./context";
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Translations } from '../translations/dictionary'
import { Link } from 'react-router-dom';

const Warning: React.FC = (props) => {
  const { global, setGlobal } = useContext(Context) as {global: any; setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const txt = Translations[global.language];

  const resend = async() => {
    setGlobal({...global, warningMessage: 'sent'});
    const jwtToken = localStorage.getItem("jwtToken");
    const response = await fetch(`${global.apiUrl}/register/resend_email`, {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({jwtToken})
    });
    console.log(response)
    if (response.status === 200) {
      setTimeout(() => { 
        setGlobal({...global, warningMessage: 'confirm'});
       }, 3000);
    }
  }
  return (    
    <div className="layout-root">
        <TransitionGroup>
            <CSSTransition key={global.warningMessage} timeout={600} classNames='warningtext'>
               <div className='warning-text'> 
                {global.warningMessage === 'confirm' && <p><span>{txt.pleaseConfirmYourEmail}</span> <Link to={{pathname: '/my/profile'}}><b>{txt.updateYourEmail}</b></Link> {txt.or} <b onClick={resend}>{txt.resendConfirmation}</b></p>}
                {global.warningMessage === 'sent' && <p>{txt.emailSent}</p>}
                {global.warningMessage === 'invalid' && <p>{txt.invalid}</p>}
                {global.warningMessage === 'confirmed' && <p>{txt.confirmed}</p>}
                {global.warningMessage === 'offline' && <p>{txt.offline}</p>}
                {global.warningMessage === 'online' && <p>{txt.online}</p>}
               </div>
            </CSSTransition>
        </TransitionGroup>
    </div>
  );
}

export { Warning };