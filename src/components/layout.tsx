import React, { useContext, useEffect } from 'react';
import { RouteProps } from 'react-router';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';
import { Footer } from './footer';
import { Modal } from './modal';
import { SideNav } from './sideNav';
import { TopNav } from './topNav';
import { Warning } from './warning';

interface PropsInterface {
  location: RouteProps['location'];
  children: RouteProps['children'];
}

const Layout: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  useEffect(() => {
    const callApi = async (path: string) => {
      if (path) {
        const response = await fetch(`${global.env.apiUrl}/my/location`, {
          body: JSON.stringify({
            jwtToken: localStorage.getItem('jwtToken'),
            location: path,
          }),
          headers: {
            // prettier-ignore
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        });
        const content = await response.json();
        if (response.status === 200) {
          localStorage.setItem('jwtToken', content.jwtToken);
          dispatch({ type: SET_SHARED, value: content.shared });
        } else {
          localStorage.clear();
          window.location.href = '/';
        }
      }
    };
    if (props.location && localStorage.getItem('jwtToken')) {
      callApi(props.location.pathname);
    }
  }, [dispatch, global.env.apiUrl, props.location]);

  let reveal = false;

  const determineLayout = (path: string) => {
    if (['my'].includes(path)) {
      return (
        <div className='layout--sidenav'>
          <SideNav location={props.location}></SideNav>
          <div>{props.children}</div>
        </div>
      );
    } else {
      return <div>{props.children}</div>;
    }
  };

  const first = props.location ? props.location.pathname.split('/')[1] : '';

  if (
    ['my'].includes(first) &&
    (!global.shared.loggedIn || !localStorage.getItem('jwtToken'))
  ) {
    window.location.href = '/';
  } else reveal = true;

  const layout = determineLayout(first);

  return (
    <div className='layout'>
      {reveal && (
        <React.Fragment>
          <header>
            <Modal screen={global.display.modal} />
            <Warning message={global.shared.warningMessage} />
            <TopNav
              loggedIn={global.shared.loggedIn}
              fullName={global.shared.fullName}
              avatar={global.shared.avatarId}
            />
          </header>
          <main className='layout--main'>{layout}</main>
        </React.Fragment>
      )}
      <Footer />
    </div>
  );
};

export { Layout };
