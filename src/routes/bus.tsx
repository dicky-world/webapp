import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Global } from '../globalState';
import { Dispatch } from '../globalState';
import { PhotoDetail } from '../utils/photoDetail';

interface ConfirmProps extends RouteComponentProps<{ id: string }> {}

const Bus: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const id = props.match.params.id;
  const zoomSquare = 250;

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
    setState((prev) => ({
      ...prev,
      mouseOver: false,
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
    if (y <= 125) {
      y = 125;
    }
    if (y >= 595) {
      y = 595;
    }
    if (x <= 125) {
      x = 125;
    }
    if (x >= 595) {
      x = 595;
    }
    return {
      backgroundImage: `url(${`https://s3-eu-west-1.amazonaws.com/img.dicky.world/${zoomId}`})`,
      backgroundPosition: ` ${0 - x * 1.39 + 125}px ${0 - y * 1.39 + 125}px`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1000px 1000px',
      left: `${x - 250 / 2}px`,
      top: `${y - 250 / 2}px`,
    };
  };

  return (
    <div className='bus'>
      <img
        src={`https://s3-eu-west-1.amazonaws.com/img.dicky.world/${zoomId}`}
        width={720}
        height={720}
        onClick={toggleZoom}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onMouseMove={mouseMove}
        className={
          zoomOn && mouseOver
            ? 'bus--image bus--over-on'
            : 'bus--image bus--over-off'
        }
      />
      {zoomOn.toString()} / {mouseOver.toString()} / {zoomPositionX} /{' '}
      {zoomPositionY}
      <div
        className={
          zoomOn && mouseOver ? 'bus--magnifier-on' : 'bus--magnifier-off'
        }
        style={magnifierStyle(zoomPositionX, zoomPositionY)}
      />
    </div>
  );
};

export { Bus };
