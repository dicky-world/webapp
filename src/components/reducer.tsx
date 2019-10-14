import { Reducer } from 'react';
import { AnyAction } from 'redux';

const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';
const OPEN_WARNING = 'WARNING';
const CLOSE_WARNING = 'CLOSE_WARNING';
const DARK_MODE = 'DARK_MODE';
const JOINED = 'JOINED';
const LOGGED_IN = 'LOGGED_IN';

export interface AppState {
  fullName?: string;
  apiUrl: string;
  language: string;
  modalState: string;
  modal: boolean;
  warning: boolean;
  loggedIn: boolean;
  darkMode: boolean;
  warningMessage: string | null;
}

const globalReducer: Reducer<AppState, AnyAction> = (state, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.value,
      };
    case OPEN_MODAL:
      return {
        ...state,
        modal: true,
        modalState: action.value,
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modal: false,
      };
    case OPEN_WARNING:
      return {
        ...state,
        warning: true,
        warningMessage: action.value,
      };
    case CLOSE_WARNING:
      return {
        ...state,
        warning: false,
        warningMessage: action.value,
      };
    case DARK_MODE:
      return {
        ...state,
        darkMode: action.value,
      };
    case JOINED:
      return {
        ...state,
        fullName: action.value,
        loggedIn: true,
        modal: false,
        warning: true,
        warningMessage: 'confirm',
      };
    case LOGGED_IN:
      return {
        ...state,
        fullName: action.value.name,
        loggedIn: true,
        modal: false,
        warning: action.value.warning,
      };
    default:
      return state;
  }
};

export {
  globalReducer,
  CHANGE_LANGUAGE,
  OPEN_MODAL,
  CLOSE_MODAL,
  OPEN_WARNING,
  CLOSE_WARNING,
  DARK_MODE,
  JOINED,
  LOGGED_IN,
};
