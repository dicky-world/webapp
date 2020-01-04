import React, { useContext, useState } from 'react';
import { Dispatch, SET_SHARED } from '../globalState';
import { DataURLToBlob } from '../utils/resizeImage';

interface PropsInterface {
  placeholder: string;
  resizeTo: number;
  saveImg: string;
  signedUrl: string;
}

const Photo: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { dispatch } = useContext(Dispatch);
  const [state, setState] = useState({
    imageURL: props.placeholder,
  });

  const { imageURL } = state;

  const uploadImg = async (resizedBlob: Blob) => {
    // get signed URL
    const response = await fetch(props.signedUrl, {
      body: JSON.stringify({
        jwtToken: localStorage.getItem('jwtToken'),
      }),
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const content = await response.json();
    if (response.status === 200) {
      // upload image
      const signedUrl = content.signedUrl;
      const response2 = await fetch(signedUrl, {
        body: resizedBlob,
        headers: {
          // prettier-ignore
          'Accept': 'application/json',
          'Content-Type': 'image/jpeg',
        },
        method: 'PUT',
      });
      if (response2.status === 200) {
        const avatarId = `${response2.url.split('/')[4]}/${
          response2.url.split('/')[5].split('?')[0]
        }`;
        // Save to api
        const response3 = await fetch(props.saveImg, {
          body: JSON.stringify({
            avatarId,
            jwtToken: localStorage.getItem('jwtToken'),
          }),
          headers: {
            // prettier-ignore
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        const content3 = await response3.json();
        dispatch({ type: SET_SHARED, value: content3.shared });
      }
    }
  };

  const resizeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = async (imageEvent) => {
          const canvas = document.createElement('canvas');
          const maxSize = props.resizeTo;
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
          ctx.imageSmoothingEnabled = false;
          let width = image.width;
          let height = image.height;
          if (width > height && width > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          } else if (height > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
          ctx.drawImage(image, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg');
          setState((prev) => ({ ...prev, imageURL: base64, height, width }));
          const blob = DataURLToBlob(base64);
          uploadImg(blob);
        };
        image.src = URL.createObjectURL(file);
      };
      if (reader) reader.readAsDataURL(file);
    }
  };

  return (
    <div className='photo'>
      <label>
        <img
          alt='your first name initial'
          className='photo--preview'
          src={imageURL}
        />
        <input
          accept='image/png, image/jpeg'
          id='photo'
          name='photo'
          onChange={resizeImage}
          type='file'
        ></input>
      </label>
    </div>
  );
};

export { Photo };
