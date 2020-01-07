import React, { useContext, useEffect, useState } from 'react';
import { Carousel } from '../components/carousel';
import { Focus } from '../components/focus';
import { Global } from '../globalState';
import { AllPhotos } from '../utils/allPhotos';

const Home: React.FC = () => {
  const { global } = useContext(Global);

  interface DataProps {
    _id: string;
    category: string;
    published: boolean;
    previewId: string;
    thumbnailId: string;
  }
  interface StateInterface {
    array: DataProps[];
  }
  const [photos, setPhotos] = useState<StateInterface>({
    array: [],
  });
  const bgImage = (imageUrl: string) => {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      paddingBottom: '100%',
    };
  };
  const getRows = () => {
    const arr = [];
    for (let i = 0; i <= photos.array.length; i++) {
      if (photos.array[i]) {
        arr.push(
          <div key={photos.array[i]._id}>
            <a href={'/bus/' + photos.array[i]._id}>
            <div className='home--image'
              style={bgImage(global.env.imgUrl + photos.array[i].previewId)}
            ></div></a>
          </div>
        );
      }
    }
    return arr;
  };

  useEffect(() => {
    const getAllPhotos = async () => {
      const content = await AllPhotos(`${global.env.apiUrl}/photos?limit=50&sortBy=newest`);
      setPhotos(() => ({ array: content.photos }));
    };
    getAllPhotos();
  }, [global.env.apiUrl]);

  return (
    <section className='home'>
      <Carousel />
      <Focus />
      <div className='home--image-container'>
      <div className='home--image-grid'>{getRows()}</div>
      </div>
    </section>
  );
};

export { Home };
