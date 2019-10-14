import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '../Router';

describe('Test', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => {
        return {
          addListener: jest.fn(),
          matches: true,
          removeListener: jest.fn(),
        };
      }),
    });
  });
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
