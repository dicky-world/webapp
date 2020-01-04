import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch, SET_SHARED } from '../globalState';
import loadingImg from '../images/loading.svg';
import { Error } from './error';

const AddPhoto: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const canvas = useRef<HTMLCanvasElement>(null);
//  let originalImage: HTMLImageElement;

  interface StateInterface {
  category: string;
  imageUrl: string;
  imageUrlError: string;
  loading: boolean;
  orientation: string;
  originalImage: HTMLImageElement;
  showResizer: boolean;
}

  const [state, setState] = useState<StateInterface>({
    category: '',
    imageUrl: '',
    imageUrlError: '',
    loading: false,
    orientation: '',
    originalImage: new Image(),
    showResizer: false,
  });

  const {
    category,
    imageUrl,
    imageUrlError,
    loading,
    showResizer,
    orientation,
    originalImage,
  } = state;

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

  const canvasControl = (image: HTMLImageElement) => {
    setState((prev) => ({...prev, originalImage: image }));
    const ctx: CanvasRenderingContext2D | null = canvas.current
      ? canvas.current.getContext('2d')
      : null;
    const maxSize = 315;
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      let width = image.width;
      let height = image.height;
      let pos: number;
      if (width > height && width > maxSize) {
        width *= maxSize / height;
        height = maxSize;
        pos = (width - maxSize) / 2;
        ctx.drawImage(image, -pos, 0, width, height);
        setState((prev) => ({ ...prev, orientation: 'landscape' }));
      } else if (height > maxSize) {
        height *= maxSize / width;
        width = maxSize;
        pos = (height - maxSize) / 2;
        ctx.drawImage(image, 0, -pos, width, height);
        setState((prev) => ({ ...prev, orientation: 'portrait' }));
      }
    }
  };

  const loadImageFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setState((prev) => ({ ...prev, loading: true }));
      const file = event.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = async (imageEvent) => {
          if (image.width > 1000 && image.height > 1000) {
            setState((prev) => ({
              ...prev,
              loading: false,
              showResizer: true,
            }));
            canvasControl(image);
          } else {
            setState((prev) => ({ ...prev, loading: false }));
            alert('image too small');
          }
        };
        image.src = URL.createObjectURL(file);
      };
      if (reader) reader.readAsDataURL(file);
    }
  };
  const loadImageFromUrl = (url: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = 1000;
    request.responseType = 'blob';
    request.onload = () => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = async (imageEvent) => {
          if (image.width > 1000 && image.height > 1000) {
            setState((prev) => ({
              ...prev,
              loading: false,
              showResizer: true,
            }));
            canvasControl(image);
          } else {
            setState((prev) => ({
              ...prev,
              imageUrl: '',
              imageUrlError: 'Image is too small',
              loading: false,
            }));
          }
        };
        image.src = URL.createObjectURL(request.response);
      };
      if (reader) reader.readAsDataURL(request.response);
    };
    request.onerror = () => {
      setState((prev) => ({
        ...prev,
        imageUrlError: 'Image cant be loaded',
        loading: false,
      }));
    };
    request.ontimeout = () => {
      setState((prev) => ({
        ...prev,
        imageUrlError: 'Image cant be loaded',
        loading: false,
      }));
    };
    request.send();
  };
  const onBlur = () => {
    setState((prev) => ({
      ...prev,
      imageUrl: '',
      imageUrlError: '',
      loading: false,
    }));
  };

  const clearImage = () => {
    setState((prev) => ({
      ...prev,
      showResizer: false,
    }));
  };

  const moveImage = (event: React.MouseEvent<HTMLElement>) => {
    const image = originalImage;
    const { id } = event.currentTarget;
    const ctx: CanvasRenderingContext2D | null = canvas.current
      ? canvas.current.getContext('2d')
      : null;
    const maxSize = 315;
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      let width = image.width;
      let height = image.height;
      let pos = 0;
      if (width > height && width > maxSize) {
        width *= maxSize / height;
        height = maxSize;
        if (id === 'll') pos = 0;
        if (id === 'lc') pos = - (width - maxSize) / 2;
        if (id === 'lr') pos = - (width - maxSize);
        ctx.drawImage(image, pos, 0, width, height);
        setState((prev) => ({ ...prev, orientation: 'landscape' }));
      } else if (height > maxSize) {
        height *= maxSize / width;
        width = maxSize;
        if (id === 'pt') pos = 0;
        if (id === 'pc') pos = - (height - maxSize) / 2;
        if (id === 'pb') pos = - (height - maxSize);
        ctx.drawImage(image, 0, pos, width, height);
        setState((prev) => ({ ...prev, orientation: 'portrait' }));
      }
    }
  };

  return (
    <div className='add-photo'>
      <h2>Add Photo</h2>
      <h3>Minimum size of 1000x1000px</h3>
      <form>
        {!showResizer && (
          <React.Fragment>
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
              onBlur={onBlur}
              placeholder='http://www.'
              type='text'
              value={imageUrl}
            />
            <Error error={imageUrlError} />
          </React.Fragment>
        )}

        {showResizer && (
          <span className='add-photo--preview'>
            <label>Preview</label>
            <canvas
              ref={canvas}
              width={315}
              height={315}
              className='add-photo--canvas'
            />
            <div className='add-photo--close' onClick={clearImage}></div>
            {orientation === 'landscape' && (
              <React.Fragment>
                <div
                  className='add-photo--base add-photo--landscape-left'
                  onClick={moveImage}
                  id='ll'
                ></div>
                <div
                  className='add-photo--base add-photo--landscape-center'
                  onClick={moveImage}
                  id='lc'
                ></div>
                <div
                  className='add-photo--base add-photo--landscape-right'
                  onClick={moveImage}
                  id='lr'
                ></div>
              </React.Fragment>
            )}
            {orientation === 'portrait' && (
              <React.Fragment>
                <div
                  className='add-photo--base add-photo--portrait-top'
                  onClick={moveImage}
                  id='pt'
                ></div>
                <div
                  className='add-photo--base add-photo--portrait-center'
                  onClick={moveImage}
                  id='pc'
                ></div>
                <div
                  className='add-photo--base add-photo--portrait-bottom'
                  onClick={moveImage}
                  id='pb'
                ></div>
              </React.Fragment>
            )}
            <button color='primary'>
              {!loading ? (
                'Upload Photo'
              ) : (
                <img src={loadingImg} alt='loading' className='loading' />
              )}
            </button>
            <div className='join--terms'>
              By uploading a photo, you agree to our
              <Link to={{ pathname: '/terms' }}> Terms of Service</Link> and
              <Link to={{ pathname: '/terms' }}> Privacy Policy</Link>
            </div>
          </span>
        )}
      </form>
    </div>
  );
};

export { AddPhoto };
