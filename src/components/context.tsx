import React from 'react';
import { AnyAction } from 'redux';
import { AppState } from './reducer';

const setGlobalContext = React.createContext<{
  setGlobal: React.Dispatch<AnyAction>;
}>({
  setGlobal: () => {
    //
  },
});

/**
 * TODO: Use default state here instead of the router component.
 * @type {React.Context<{global: AppState}>}
 */
const globalContext = React.createContext<{ global: AppState }>({
  global: {
    apiUrl: '',
    darkMode: false,
    language: 'en',
    loggedIn: false,
    modal: false,
    modalState: '',
    warning: false,
    warningMessage: '',
  },
});

export { setGlobalContext, globalContext };
