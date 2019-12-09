import { createContext } from 'react';

interface StateInterface {
  display: {
    modal: string;
  };
  env: {
    apiUrl: string;
  };
  shared: {
    avatarId: string;
    email: string;
    fullName: string;
    investorConfirmed: boolean;
    investorSubmitted: boolean;
    language: string;
    location: string;
    loggedIn: boolean;
    warningMessage: string;
    worbliAccountName: string;
    worbliConfirmed: boolean;
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
  },
  shared: localShared || {
    avatarId: '',
    email: '',
    fullName: 'John Doe',
    investorConfirmed: false,
    investorSubmitted: false,
    language: 'en',
    location: '',
    loggedIn: false,
    warningMessage: '',
    worbliAccountName: '',
    worbliConfirmed: false,
  },
};

const Global = createContext({
  global: InitialState,
});

const SET_AVATAR = 'SET_AVATAR';
const SET_EMAIL = 'SET_EMAIL';
const SET_FULLNAME = 'SET_FULLNAME';
const LOGGED_IN = 'LOGGED_IN';
const SET_MODAL = 'SET_MODAL';
const WARNING_MESSAGE = 'WARNING_MESSAGE';
const SET_SHARED = 'SET_SHARED';

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
  Reducer,
  InitialState,
  Dispatch,
  Global,
  SET_AVATAR,
  WARNING_MESSAGE,
  LOGGED_IN,
  SET_EMAIL,
  SET_FULLNAME,
  SET_MODAL,
  SET_SHARED,
};
