import React, { useContext, useRef } from 'react';
import { TRANSLATIONS } from '../translations/dictionary';
import { globalContext } from './context';

export function Sent(): JSX.Element {
  const { global } = useContext(globalContext);
  const txt = TRANSLATIONS[global.language];
  const sentForm = useRef<HTMLFormElement>(null);

  return (
    <div>
      <h2>{txt.resetEmailSent}</h2>
      <h3>{txt.weWillSendPasswordResetIf}</h3>
      <form ref={sentForm}>
        <button color='primary'>{txt.login}</button>
      </form>
    </div>
  );
}
