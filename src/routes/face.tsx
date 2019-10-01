import React, {useContext} from 'react';
import { Context } from '../components/context';

const Face: React.FC = () => {
  const { setGlobal, global } = useContext(Context) as {global: any; setGlobal: React.Dispatch<React.SetStateAction<any>>};


  return (
    <span className='page'>
      Face
    </span>
  );
}

export { Face };