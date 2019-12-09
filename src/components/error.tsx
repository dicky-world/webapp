import React from 'react';
import { CSSTransition } from 'react-transition-group';

interface PropsInterface {
  error: string;
}

const Error: React.FC<PropsInterface> = (props: PropsInterface) => {
  return (
    <React.Fragment>
      <CSSTransition
        in={!!props.error}
        appear={!!props.error}
        timeout={400}
        classNames='error'
      >
        <small className='error'>{props.error}</small>
      </CSSTransition>
    </React.Fragment>
  );
};

export { Error };
