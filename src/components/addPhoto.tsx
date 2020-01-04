import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dispatch, Global, SET_MODAL } from '../globalState';
import loadingImg from '../images/loading.svg';
import { ResizeImage } from '../utils/resizeImage';
import { SaveImage } from '../utils/saveImage';
import { SignedUrl } from '../utils/signedUrl';
import { UploadToS3 } from '../utils/uploadToS3';
import { Error } from './error';

const AddPhoto: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  interface StateInterface {
    category: string;
    imageFileError: string;
    imageUrl: string;
    imageUrlError: string;
    loading: boolean;
    orientation: string;
    originalImage: HTMLImageElement;
    positionId: string;
    showResizer: boolean;
  }

  const [state, setState] = useState<StateInterface>({
    category: '',
    imageFileError: '',
    imageUrl: '',
    imageUrlError: '',
    loading: false,
    orientation: '',
    originalImage: new Image(),
    positionId: '',
    showResizer: false,
  });

  const {
    category,
    imageFileError,
    imageUrl,
    imageUrlError,
    loading,
    orientation,
    originalImage,
    positionId,
    showResizer,
  } = state;

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    setState((prev) => ({ ...prev, originalImage: image }));
    const ctx: CanvasRenderingContext2D | null = canvas.current
      ? canvas.current.getContext('2d')
      : null;
    const maxSize = 320;
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
            setState((prev) => ({
              ...prev,
              imageFileError: 'Image is too small',
              loading: false,
            }));
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
    const maxSize = 320;
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      let width = image.width;
      let height = image.height;
      let pos = 0;
      if (width > height && width > maxSize) {
        width *= maxSize / height;
        height = maxSize;
        if (id === 'll') pos = 0;
        if (id === 'lc') pos = -(width - maxSize) / 2;
        if (id === 'lr') pos = -(width - maxSize);
        ctx.drawImage(image, pos, 0, width, height);
        setState((prev) => ({
          ...prev,
          orientation: 'landscape',
          positionId: id,
        }));
      } else if (height > maxSize) {
        height *= maxSize / width;
        width = maxSize;
        if (id === 'pt') pos = 0;
        if (id === 'pc') pos = -(height - maxSize) / 2;
        if (id === 'pb') pos = -(height - maxSize);
        ctx.drawImage(image, 0, pos, width, height);
        setState((prev) => ({
          ...prev,
          orientation: 'portrait',
          positionId: id,
        }));
      }
    }
  };

  const uploadImages = async (event: React.FormEvent) => {
    event.preventDefault();
    const signedUrlApiEndpoint = `${global.env.apiUrl}/upload/signed-url`;
    const saveImageApiEndpoint = `${global.env.apiUrl}/my/images`;
    let thumbnailId;
    let previewId;
    let zoomId;
    setState((prev) => ({ ...prev, loading: true }));
    const thumbnailSignedUrl = await SignedUrl(signedUrlApiEndpoint);
    const resizedThumbnail = await ResizeImage(originalImage, 180, positionId);
    if (thumbnailSignedUrl && resizedThumbnail) {
      thumbnailId = await UploadToS3(thumbnailSignedUrl, resizedThumbnail);
    } else alert('s3 error');
    const previewSignedUrl = await SignedUrl(signedUrlApiEndpoint);
    const resizedPreview = await ResizeImage(originalImage, 530, positionId);
    if (previewSignedUrl && resizedPreview) {
      previewId = await UploadToS3(previewSignedUrl, resizedPreview);
    } else alert('s3 error');
    const zoomSignedUrl = await SignedUrl(signedUrlApiEndpoint);
    const resizedZoom = await ResizeImage(originalImage, 1000, positionId);
    if (zoomSignedUrl && resizedZoom) {
      zoomId = await UploadToS3(zoomSignedUrl, resizedZoom);
    } else alert('s3 error');
    if (thumbnailId && previewId && zoomId) {
      const imagesSaved = await SaveImage(saveImageApiEndpoint);
      console.log(imagesSaved);
    } else alert('err');
    setState((prev) => ({ ...prev, loading: false }));
    dispatch({ type: SET_MODAL, value: '' });
  };

  return (
    <div className='add-photo'>
      <h2>Add Photo</h2>
      <h3>Minimum photo size of 1000x1000px</h3>
      <form onSubmit={uploadImages}>
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
            <Error error={imageFileError} />
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
            <div>
            <label>Position</label>
            <canvas
              ref={canvas}
              width={320}
              height={320}
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
            </div>
            <select id='category' value={category} onChange={onChange} className='add-photo--category'>
              <option key='Select' value=''>Select...</option>
              <option key='Double Decker' value='Double Decker'>Double Decker</option>
              <option key='Single Decker' value='Single Decker'>Single Decker</option>
              <option key='Midi' value='Midi'>Midi</option>
              <option key='Mini' value='Mini'>Mini</option>
              <option key='Coaches' value='Coaches'>Coaches</option>
            </select>
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
