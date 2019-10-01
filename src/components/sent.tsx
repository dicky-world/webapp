import React, { useContext, useRef } from 'react';
import { Context } from "./context";
import { Translations } from '../translations/dictionary';

const Sent: React.FC = () => {
  const { global } = useContext(Context) as {global: any; setGlobal: React.Dispatch<React.SetStateAction<any>>};
  const txt = Translations[global.language];
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

export { Sent };
