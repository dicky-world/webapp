import { createContext } from 'react';

interface StateInterface {
  display: {
    modal: string;
  };
  env: {
    apiUrl: string;
    imgUrl: string;
  };
  shared: {
    avatarId: string;
    bio: string;
    country: string;
    coverId: string;
    currency: string;
    dob: string;
    email: string;
    followers: string,
    following: string,
    fullName: string;
    gender: string;
    language: string;
    location: string;
    loggedIn: boolean;
    username: string;
    warningMessage: string;
    webSite: string;
  };
}

interface ActionInterface {
  type: string;
  value: string | boolean;
}

const Dispatch = createContext({
  dispatch: (action: ActionInterface) => {
    //
  },
});

let localShared;
const savedData = localStorage.getItem('shared');
if (savedData) localShared = JSON.parse(savedData);

const InitialState: StateInterface = {
  display: {
    modal: '',
  },
  env: {
    apiUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://api.dicky.world'
        : 'http://localhost:8888',
    imgUrl: 'https://s3-eu-west-1.amazonaws.com/img.dicky.world/',
  },
  shared: localShared || {
    avatarId: '',
    bio: '',
    country: '',
    coverId: '',
    currency: 'USD',
    dob: '2011-04-11',
    email: '',
    followers: 0,
    following: 0,
    fullName: '',
    gender: 'other',
    language: 'en',
    location: '',
    loggedIn: false,
    username: '',
    warningMessage: '',
    webSite: '',
  },
};

const Global = createContext({
  global: InitialState,
});

const LOGGED_IN = 'LOGGED_IN';
const SET_AVATAR = 'SET_AVATAR';
const SET_EMAIL = 'SET_EMAIL';
const SET_FULLNAME = 'SET_FULLNAME';
const SET_MODAL = 'SET_MODAL';
const SET_SHARED = 'SET_SHARED';
const WARNING_MESSAGE = 'WARNING_MESSAGE';

// tslint:disable-next-line: no-any
const Reducer = (state: StateInterface, action: any) => {
  switch (action.type) {
    case 'SET_SHARED':
      localStorage.setItem('shared', JSON.stringify(action.value));
      return {
        ...state,
        display: { ...state.display, modal: '' },
        shared: action.value,
      };
    case 'SET_AVATAR':
      return {
        ...state,
        shared: { ...state.shared, avatar: action.value },
      };
    case 'SET_EMAIL':
      return {
        ...state,
        shared: { ...state.shared, email: action.value },
      };
    case 'SET_FULLNAME':
      return {
        ...state,
        shared: { ...state.shared, fullName: action.value },
      };
    case 'SET_MODAL':
      return {
        ...state,
        display: { ...state.display, modal: action.value },
      };
    case 'WARNING_MESSAGE':
      return {
        ...state,
        shared: { ...state.shared, warningMessage: action.value },
      };
    case 'LOGGED_IN':
      return {
        ...state,
        shared: { ...state.shared, loggedIn: action.value, warningMessage: ''},
      };
    default:
      return state;
  }
};

export {
  Dispatch,
  Global,
  InitialState,
  LOGGED_IN,
  Reducer,
  SET_AVATAR,
  SET_EMAIL,
  SET_FULLNAME,
  SET_MODAL,
  SET_SHARED,
  WARNING_MESSAGE,
};
