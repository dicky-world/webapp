import React from 'react';
import { CSSTransition } from 'react-transition-group';

interface PropsInterface {
  error: string;
}

const Error: React.FC<PropsInterface> = (props: PropsInterface) => {
  return (
    <React.Fragment>
      {props.error && (
        <CSSTransition
          appear={!!props.error}
          classNames='error'
          in={!!props.error}
          timeout={400}
        >
          <small className='error'>{props.error}</small>
        </CSSTransition>
      )}
    </React.Fragment>
  );
};

export { Error };
