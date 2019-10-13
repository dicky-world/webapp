import React, {useContext} from 'react';
import { setGlobalContext, globalContext } from '../components/context';

const Face: React.FC = () => {
  const { global } = useContext(globalContext) as {global: any};
  const { setGlobal } = useContext(setGlobalContext) as {setGlobal: React.Dispatch<React.SetStateAction<any>>};

  return (
    <span className='page'>
      Face
    </span>
  );
}

export { Face };