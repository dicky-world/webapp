import React, { useState } from 'react';

interface PropsInterface {
  placeholder: string;
  resizeTo: number;
  blob?: Function;
  base64?: Function;
}

const Photo: React.FC<PropsInterface> = (props: PropsInterface) => {

  const [state, setState] = useState({
    imageURL: props.placeholder,
  });

  const {
    imageURL,
  } = state;

  const dataURLToBlob = (dataURL: string) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
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
          let width = image.width;
          let height = image.height;
          if (width > height && width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
          } else if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          const resizedImage = dataURLToBlob(dataUrl);
          setState((prev) => ({ ...prev, imageURL: dataUrl }));
          if (props.blob) props.blob(resizedImage);
          if (props.base64) props.base64(dataUrl);
        };
        image.src = URL.createObjectURL(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='photo'>
      <label>
        <img
          src={imageURL}
          alt='your first name initial'
          className='photo--preview'
        />
        <input
          type='file'
          id='photo'
          name='photo'
          accept='image/png, image/jpeg'
          onChange={resizeImage}
        ></input>
      </label>
    </div>
  );
};

export { Photo };
