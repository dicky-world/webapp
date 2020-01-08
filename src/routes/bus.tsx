import React, { useContext, useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch } from '../globalState';
import { PhotoDetail } from '../utils/photoDetail';

interface ConfirmProps extends RouteComponentProps<{ id: string }> {}

const Bus: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const image = useRef<HTMLDivElement>(null);
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const id = props.match.params.id;

  const [state, setState] = useState({
    category: '',
    mouseOver: false,
    zoomId: '',
    zoomOn: false,
    zoomPositionX: 0,
    zoomPositionY: 0,
  });

  const {
    category,
    zoomId,
    zoomOn,
    mouseOver,
    zoomPositionX,
    zoomPositionY,
  } = state;

  useEffect(() => {
    const getData = async () => {
      const response = await PhotoDetail(
        `${global.env.apiUrl}/photos/detail?id=${id}`
      );
      setState((prev) => ({
        ...prev,
        category: response.category,
        zoomId: response.zoomId,
      }));
    };
    getData();
  }, []);

  const toggleZoom = (event: React.MouseEvent) => {
    event.persist();
    setState((prev) => ({
      ...prev,
      zoomOn: !zoomOn,
      zoomPositionX: event.nativeEvent.offsetX,
      zoomPositionY: event.nativeEvent.offsetY,
    }));
  };

  const mouseEnter = () => {
    setState((prev) => ({
      ...prev,
      mouseOver: true,
    }));
  };

  const mouseLeave = () => {
    let _mouseOver = false;
    if (zoomOn) _mouseOver = true;
    else _mouseOver = false;
    setState((prev) => ({
      ...prev,
      mouseOver: _mouseOver,
    }));
  };

  const mouseMove = (event: React.MouseEvent) => {
    event.persist();
    if (zoomOn) {
      setState((prev) => ({
        ...prev,
        zoomPositionX: event.nativeEvent.offsetX,
        zoomPositionY: event.nativeEvent.offsetY,
      }));
    }
  };

  const magnifierStyle = (x: number, y: number) => {
    let imageWidth;
    if (image && image.current) {
      imageWidth = image.current.clientWidth;
    }
    if (imageWidth) {
      const magnifierMiddle = 250 / 2;
      const magnification = 1.5;
      const backgroundSize = imageWidth * magnification;
      if (zoomId) {
        if (y <= magnifierMiddle) {
          y = magnifierMiddle;
        }
        if (y >= imageWidth - magnifierMiddle) {
          y = imageWidth - magnifierMiddle;
        }
        if (x <= magnifierMiddle) {
          x = magnifierMiddle;
        }
        if (x >= imageWidth - magnifierMiddle) {
          x = imageWidth - magnifierMiddle;
        }
      }
      return {
        backgroundImage: `url(${`${global.env.imgUrl}${zoomId}`})`,
        backgroundPosition: ` ${0 - x * magnification + magnifierMiddle}px ${0 -
          y * magnification +
          magnifierMiddle}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${backgroundSize}px ${backgroundSize}px`,
        left: `${x - magnifierMiddle}px`,
        top: `${y - magnifierMiddle}px`,
      };
    }
  };
  const bgImage = () => {
    let imageWidth;
    let backgroundSize;
    if (image && image.current) {
      imageWidth = image.current.clientWidth;
    }
    const magnification = 2;
    if (imageWidth) {
      backgroundSize = imageWidth * magnification;
    }
    return {
      backgroundImage: `url(${`${global.env.imgUrl}${zoomId}`})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: `cover`,
      paddingBottom: '100%',
    };
  };

  return (
    <div className='outer'>
    <div className='bus'>
      <div>
        {zoomId && (
          <div
            ref={image}
            style={bgImage()}
            onClick={toggleZoom}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            onMouseMove={mouseMove}
            className={
              zoomOn && mouseOver
                ? 'bus--image bus--over-on'
                : 'bus--image bus--over-off'
            }
          >
            <div
              className={
                zoomOn && mouseOver ? 'bus--magnifier-on' : 'bus--magnifier-off'
              }
              style={magnifierStyle(zoomPositionX, zoomPositionY)}
            />
          </div>
        )}
      </div>
      <div></div>
    </div>
    </div>
  );
};

export { Bus };
