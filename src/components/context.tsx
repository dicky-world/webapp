import React from 'react';
import { AnyAction } from 'redux';
import { defaultState } from './reducer';

const setGlobalContext = React.createContext<{
  setGlobal: React.Dispatch<AnyAction>;
}>({
  setGlobal: () => {
    //
  },
});

const globalContext = React.createContext({ global: defaultState });

export { setGlobalContext, globalContext };
