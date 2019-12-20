import React from 'react';
import { Carousel } from '../components/carousel';
import { Focus } from '../components/focus';

const Home: React.FC = () => {
  return (
    <section>
      <Carousel />
      <Focus />
    </section>
  );
};

export { Home };
