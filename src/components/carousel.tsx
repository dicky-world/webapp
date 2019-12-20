import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import leftChevron from '../images/carousel/left-dark.svg';
import rightChevron from '../images/carousel/right-dark.svg';
import image1 from '../images/carousel/screen-1.jpg';
import image2 from '../images/carousel/screen-2.jpg';
import image3 from '../images/carousel/screen-3.jpg';
import image4 from '../images/carousel/screen-4.jpg';
import image5 from '../images/carousel/screen-5.jpg';

const Carousel: React.FC = () => {
  interface StateInterface {
    showImage: string;
    startSlide: number;
    index: number;
  }

  const [state, setState] = useState<StateInterface>({
    index: 0,
    showImage: image1,
    startSlide: 0,
  });

  const images = [image1, image2, image3, image4, image5];
  images.forEach((image) => {
    new Image().src = image;
  });

  const sliderStyle = {
    backgroundImage: 'url(' + state.showImage + ')',
  };
  const getText = (index: number) => {
    if (index === 0) {
      return (
        <div className='carousel--text-container'>
          <h3 className='carousel--top-title'>Top title 1</h3>
          <h2 className='carousel--main-title'>Main Title 1</h2>
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className='carousel--text-container'>
          <h3 className='carousel--top-title'>Top title 2</h3>
          <h2 className='carousel--main-title'>Main Title 2</h2>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className='carousel--text-container'>
          <h3 className='carousel--top-title'>Top title 3</h3>
          <h2 className='carousel--main-title'>Main Title 3</h2>
        </div>
      );
    }
    if (index === 3) {
      return (
        <div className='carousel--text-container'>
          <h3 className='carousel--top-title'>Top title 4</h3>
          <h2 className='carousel--main-title'>Main Title 4</h2>
        </div>
      );
    }
    if (index === 4) {
      return (
        <div className='carousel--text-container'>
          <h3 className='carousel--top-title'>Top title 5</h3>
          <h2 className='carousel--main-title'>Main Title 5</h2>
        </div>
      );
    }
  };

  const chipStyle = (index: number, position: number) => {
    const chipOn = {
      backgroundColor: 'rgba(255,255,255, 1)',
    };
    const chipOff = {
      backgroundColor: 'rgba(255,255,255, 0.4)',
    };
    if (index === position) return chipOn;
    else return chipOff;
  };

  let myTimer: NodeJS.Timeout;

  const increment = () => {
    clearTimeout(myTimer);
    let currentIndex = state.startSlide;
    if (currentIndex < 4) currentIndex++;
    else currentIndex = 0;
    setState({
      ...state,
      index: currentIndex,
      showImage: images[currentIndex],
      startSlide: currentIndex,
    });
  };

  const decrement = () => {
    clearTimeout(myTimer);
    let currentIndex = state.startSlide;
    if (currentIndex === 0) currentIndex = 4;
    else currentIndex = currentIndex - 1;
    setState({
      ...state,
      index: currentIndex,
      showImage: images[currentIndex],
      startSlide: currentIndex,
    });
  };

  useEffect(() => {
    let currentIndex = state.startSlide;
    if (currentIndex < 4) currentIndex++;
    else currentIndex = 0;
    myTimer = setTimeout(() => {
      setState({
        index: currentIndex,
        showImage: images[currentIndex],
        startSlide: currentIndex,
      });
    }, 3000);
  }, [state, setState]);

  return (
    <div className='carousel'>
      <div className='carousel--decrement' onClick={decrement}>
        <img src={leftChevron} className='carousel--leftChevron' alt='left' />
      </div>
      <div className='carousel--increment' onClick={increment}>
        <img
          src={rightChevron}
          className='carousel--rightChevron'
          alt='right'
        />
      </div>
      <div className='carousel--location'>
        <div className='carousel--container'>
          <div
            className='carousel--location-chip'
            style={chipStyle(state.index, 0)}
          ></div>
          <div
            className='carousel--location-chip'
            style={chipStyle(state.index, 1)}
          ></div>
          <div
            className='carousel--location-chip'
            style={chipStyle(state.index, 2)}
          ></div>
          <div
            className='carousel--location-chip'
            style={chipStyle(state.index, 3)}
          ></div>
          <div
            className='carousel--location-chip'
            style={chipStyle(state.index, 4)}
          ></div>
        </div>
      </div>
      <TransitionGroup>
        <CSSTransition
          key={state.index || ''}
          timeout={500}
          classNames='carousel--slider'
        >
          <div className='carousel--slider' style={sliderStyle}>
            {getText(state.index)}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export { Carousel };
