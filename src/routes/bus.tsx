import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';
import { PhotoDetail } from '../utils/photoDetail';

interface ConfirmProps extends RouteComponentProps<{ id: string }> {}

const Bus: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const id = props.match.params.id;

  const [state, setState] = useState({
    category: '',
    zoomId: '',
  });

  const { category, zoomId } = state;

  useEffect(() => {
    const getData = async () => {
      const response = await PhotoDetail(`${global.env.apiUrl}/photos/detail?id=${id}`);
      setState((prev) => ({ ...prev, category: response.category, zoomId: response.zoomId }));
    };
    getData();
  }, []);

  return (
    <div className='bus'>
     <img src={`https://s3-eu-west-1.amazonaws.com/img.dicky.world/${zoomId}`} width={720} height={720} className='bus--image'/>
    </div>
  );
};

export { Bus };
