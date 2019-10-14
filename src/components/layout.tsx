import React, { useContext, useEffect, useRef, useState} from 'react';
import { CSSTransition } from 'react-transition-group';
import { globalContext, setGlobalContext } from './context';
import { Join } from './join';
import { Login } from './login';
import { CLOSE_MODAL, CLOSE_WARNING, DARK_MODE, OPEN_WARNING } from './reducer';
import { Reset } from './reset';
import { Sent } from './sent';
import { TopNav } from './topnav';
import { Warning } from './warning';

interface propsInterface {
  location: any;
}

const Layout: React.FC<propsInterface> = (props) => {
  const { global } = useContext(globalContext) as {global: any};
  const { setGlobal } = useContext(setGlobalContext) as {setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const [state, setState] = useState({ admin: false });

  const layoutGrid = useRef<HTMLDivElement>(null);
  const layoutHeader = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    setGlobal({type: CLOSE_MODAL});
  };

  useEffect(() => {
    const currentFolder = props.location.pathname.split('/')[1];
    currentFolder === 'my' ? setState({ admin: true }) : setState({ admin: false });
  }, [props.location]);

  useEffect(() => {
    // const modeChanged = (event: { matches: boolean; }) => {
    //   setGlobal({type: DARK_MODE, action: event.matches});
    // };
    const nowOffline = () => {
      setGlobal({type: OPEN_WARNING, action: 'offline'});
    };
    const nowOnline = () => {
      setGlobal({type: OPEN_WARNING, action: 'online'});
      setTimeout(() => {
        setGlobal({type: CLOSE_WARNING, action: ''});
       }, 3000);
    };
    // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', modeChanged);
    window.addEventListener('online',  nowOnline);
    window.addEventListener('offline', nowOffline);
    return () => {
     // window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', modeChanged);
      window.removeEventListener('online', nowOnline);
      window.removeEventListener('offline', nowOffline);
    };
  }, [setGlobal]);

  return (
    <div className='layout-grid' ref={layoutGrid}>

      <header className='layout-header' ref={layoutHeader}>
        <CSSTransition in={global.warning} appear={global.warning} timeout={400} classNames='warning'>
          <div className='warning'><Warning/></div>
        </CSSTransition>
        <div className='layout-navigation'><TopNav/></div>
      </header>

      <CSSTransition in={global.warning} appear={global.warning} timeout={400} classNames='warningbody'>
        <span className='warning-false'>
          {state.admin  &&
            <main className='layout-admin'>
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
};

export { Layout };
