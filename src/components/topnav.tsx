import React, { useContext } from 'react';
import { Context } from "./context";
import { Translations } from '../translations/dictionary';
import { Link } from 'react-router-dom';

const TopNav: React.FC = () => {
  const { global, setGlobal } = useContext(Context) as {global: any; setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const txt = Translations[global.language];

  const openModal = (event: any) => {
    setGlobal({...global, modal: true, modalState: event.target.id})
  }

  return (    
    <div className="topNav">
        <div><Link to={{pathname: '/'}}><h1 className='logo'>{txt.siteName}</h1></Link></div>
        <div></div>
        {!global.loggedIn &&
        <div>
          <div className='buttons-desktop'>
            <div onClick={openModal} id='join'><button className='joinButton'>{txt.join} <span className='siteName'>{txt.siteName}</span></button></div>
            <div onClick={openModal} id='login'><button className='loginButton'>{txt.login}</button></div>
          </div>
          <div className='buttons-mobile'>
            <div><Link to={{pathname: '/join'}}><button className='joinButton'>{txt.join} <span className='siteName'>{txt.siteName}</span></button></Link></div>
            <div><Link to={{pathname: '/login'}}><button className='loginButton'>{txt.login}</button></Link></div>
          </div>
        </div>
        }
        {global.loggedIn &&
        <div>{global.fullName}</div>
        }
    </div>
  );
}

export { TopNav };


