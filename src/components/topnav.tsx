import React, { useContext, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch, LOGGED_IN, SET_MODAL } from '../globalState';

//interface PropsInterface extends RouteComponentProps {
interface PropsInterface {
  avatar: string;
  loggedIn: boolean;
  fullName: string;
}

const TopNav: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const firstName = props.fullName.split(' ')[0];
  const initial = firstName.charAt(0).toLowerCase();
  const imagePath = props.avatar
    ? global.env.imgUrl + props.avatar
    : global.env.imgUrl + `initials/${initial}.png`;
  const [state, setState] = useState({
    dropDownStatus: false,
    search: '',
  });

  const {
    search,
  } = state;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const { id, value } = event.target;
    setState((prev) => ({ ...prev, [id]: value }));
  };

  const login = () => {
    dispatch({ type: SET_MODAL, value: 'login' });
  };

  const join = () => {
    dispatch({ type: SET_MODAL, value: 'join' });
  };

  const logOut = () => {
    localStorage.clear();
    dispatch({ type: LOGGED_IN, value: false });
  };

  const dropDown = () => {
    setState((prev) => ({
      ...prev,
      dropDownStatus: true,
    }));
  };

  const searchApi = (event: React.FormEvent) => {
    event.preventDefault();
    // props.history.push(`/search/${search}`);
  };

  window.onclick = (event: any) => {
    if (
      // TODO: change to useref
      event.target.id !== 'dropdown'
    ) {
      setState((prev) => ({
        ...prev,
        dropDownStatus: false,
      }));
    }
  };

  const determineButtons = () => {
    if (props.loggedIn) {
      return (
        <div className='topnav--buttons' onClick={dropDown} id='dropdown'>
          <div className='topnav--avatar' id='dropdown'>
            <img src={imagePath} alt='your first name initial' id='dropdown'/>
            <div id='dropdown'>{firstName}</div>
            <div
            className={`topnav--dropdown ${state.dropDownStatus === true &&
              'topnav--dropdownon'}`}
          >
            <Link to={{ pathname: `/add/photos` }}>
              <div className='topnav--item topnav--add-photos'>Add photos</div>
            </Link>
            <Link to={{ pathname: `/${global.shared.username}` }}>
              <div className='topnav--item topnav--profile'>Profile</div>
            </Link>
            <hr />
            <Link to={{ pathname: `/my/profile` }}>
              <div className='topnav--item'>Settings</div>
            </Link>
            <div className='topnav--item' onClick={logOut}>
              Logout
            </div>
          </div>
          </div>
        </div>
      );
    }
    if (!props.loggedIn) {
      return (
        <div className='topnav--buttons'>
          <button color='primary' onClick={join}>
            Join Dicky
          </button>
          <button color='secondary' onClick={login}>
            Login
          </button>
        </div>
      );
    }
  };

  const buttons = determineButtons();

  return (
    <nav className='topnav'>
      <div className='topnav--container'>
        <div className='topnav--logo'>
          <Link to='/'>Logo</Link>
        </div>
        <div className='topnav--search'>
          <form className='topnav--search-form' onSubmit={searchApi}>
            <input
            type='text'
            className='topnav--search-input'
            placeholder='Search for names'
            onChange={onChange}
            id='search'
            />
          </form>
        </div>
        {buttons}
      </div>
    </nav>
  );
};

export { TopNav };
