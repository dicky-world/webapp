import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';

interface ConfirmProps extends RouteComponentProps<{ id: string }> {}

const Bus: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const id = props.match.params.id;

  const [state, setState] = useState({
    apiError: '',
  });

  const { apiError } = state;
  useEffect(() => {
    console.log('FIRE1');
  }, []);

  return (
    <div className='page'>
      {apiError && <div className='error--api'>{apiError}</div>}
    </div>
  );
};

export { Bus };
