import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';
import loadingImg from '../images/loading.svg';
import { Error } from './error';

const AddPhoto: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const [state, setState] = useState({
    category: '',
    imageUrl: '',
    imageUrlError: '',
    loading: false,
  });

  const { category, imageUrl, imageUrlError, loading } = state;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const { id, value } = event.target;
    setState((prev) => ({ ...prev, [id]: value }));
    if (id === 'imageUrl') validate(id, value);
  };

  const validate = (id: string, value: string) => {
    if (id === 'imageUrl') {
      if (!/\.(jpg|jpeg|gif|png)/.test(value)) {
        setState((prev) => ({
          ...prev,
          imageUrlError: 'This is not an image url',
        }));
        return false;
      } else {
        setState((prev) => ({ ...prev, imageUrlError: '' }));
        loadImageFromUrl(value);
        return true;
      }
    }
  };

  const loadImageFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = async (imageEvent) => {
          // tslint:disable-next-line: no-console
          console.log(image);
        };
        image.src = URL.createObjectURL(file);
      };
      if (reader) reader.readAsDataURL(file);
    }
  };
  const loadImageFromUrl = (url: string) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'blob';
    request.onload = () => {

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = async (imageEvent) => {
          // tslint:disable-next-line: no-console
          console.log(image);
        };
        image.src = URL.createObjectURL(request.response);
      };
      if (reader) reader.readAsDataURL(request.response);
    };
    request.send();
  };

  return (
    <div className='add-photo'>
      <h2>Add Photo {imageUrlError}</h2>
      <h3>Contribute to the largest repository of bus photos online</h3>
      <div>
        <label>
          <div className='add-photo--button'>Select photo to upload</div>
          <input
            accept='image/png, image/jpeg'
            id='photo'
            name='photo'
            onChange={loadImageFromFile}
            type='file'
          ></input>
        </label>
        <span className='add-photo--hr-span'>
          <hr className='add-photo--hr' />
          <div className='add-photo--or'>Or</div>
        </span>
        <label className='add-photo--paste-label'>Paste image url</label>
        <input
          id='imageUrl'
          onChange={onChange}
          placeholder='http://www.'
          type='text'
          value={imageUrl}
        />
        <Error error={imageUrlError} />

        {/* <button color='primary'>
          {!loading ? (
            'Add Photo'
          ) : (
            <img src={loadingImg} alt='loading' className='loading' />
          )}
        </button> */}
        {/* <div className='join--terms'>
          By uploading a photo, you agree to our
          <Link to={{ pathname: '/terms' }}> Terms of Service</Link> and
          <Link to={{ pathname: '/terms' }}> Privacy Policy</Link>
        </div> */}
      </div>
    </div>
  );
};

export { AddPhoto };
