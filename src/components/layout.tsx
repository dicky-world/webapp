import React, { useContext, useEffect, useRef, useState} from 'react';
import { Context } from "./context";
import { Warning } from "./warning";
import { TopNav } from "./topnav";
import { Join } from "./join";
import { Login } from "./login";
import { Reset } from "./reset";
import { Sent } from "./sent";
import { CSSTransition } from 'react-transition-group'

interface propsInterface {
  location: any; 
}

const Layout: React.FC<propsInterface> = (props) => {
  const { global, setGlobal } = useContext(Context) as {global: any; setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const [state, setState] = useState({ admin: false }); 

  let layoutGrid = useRef<HTMLDivElement>(null);
  let layoutHeader = useRef<HTMLDivElement>(null);
  
  const closeModal = () => {
    setGlobal({...global, modal: false});
  }

  useEffect(() => {
    const currentFolder = props.location.pathname.split('/')[1];
    currentFolder === 'my' ? setState({ admin: true }) : setState({ admin: false })
  }, [props.location])

  useEffect(() => {
    const modeChanged = (event: { matches: boolean; }) => {
      setGlobal({...global, darkMode: event.matches});
    }
    const nowOffline = () => {
      setGlobal({...global, warning: true, warningMessage: 'offline'});
    }
    const nowOnline = () => {
      setGlobal({...global,  warning: true, warningMessage: 'online'});
      setTimeout(() => {
        setGlobal({...global,  warning: false, warningMessage: ''});
       }, 3000);
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", modeChanged);
    window.addEventListener('online',  nowOnline);
    window.addEventListener('offline', nowOffline);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener("change", modeChanged);
      window.removeEventListener('online', nowOnline);
      window.removeEventListener('offline', nowOffline);
    } 
  }, [global, setGlobal]);

  return (    
    <div className="layout-grid" ref={layoutGrid}>

      <header className="layout-header" ref={layoutHeader}>
        <CSSTransition in={global.warning} appear={global.warning} timeout={400} classNames='warning'>
          <div className='warning'><Warning/></div>
        </CSSTransition>
        <div className="layout-navigation"><TopNav/></div>
      </header>

      <CSSTransition in={global.warning} appear={global.warning} timeout={400} classNames='warningbody'>
        <span className='warning-false'>
          {state.admin  &&
            <main className="layout-admin">
              <div className='page-holder'>{props.children}</div>
              <CSSTransition in={global.warning} appear={global.warning} timeout={400} classNames='warningnav'>
              <div className='admin-nav'><div className='admin-fixed'>Admin Nav</div></div>
              </CSSTransition>
            </main>
          }
          {!state.admin && <div className='page-holder'>{props.children}</div>}
        </span>
      </CSSTransition>

      <footer className='layout-footer'>Footer</footer>
      <footer className='mobile-footer'>Mobile Footer</footer>

      <CSSTransition in={global.modal} appear={global.modal} timeout={400} classNames='modal'>
        <div className='modal'>
          <div className='closeModal' onClick={closeModal}>+</div>
          <CSSTransition in={global.modal} appear={global.modal} timeout={400} classNames='modalWindow'>
            <div className='modalWindow'>
              {global.modalState === 'join' && <div className='modalCard card'><Join/></div>}
              {global.modalState === 'login' && <div className='modalCard card'><Login/></div>}
              {global.modalState === 'reset' && <div className='modalCard card'><Reset/></div>}
              {global.modalState === 'sent' && <div className='modalCard card'><Sent/></div>}
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </div>
  );
}

export { Layout };