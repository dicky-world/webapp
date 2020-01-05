import React, { useContext, useEffect, useState } from 'react';
import { Global } from '../../globalState';
import { Dispatch, SET_MODAL } from '../../globalState';
import { GetMyPhotos } from '../../utils/getMyPhotos';

const Photos: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const apiEndpoint = `${global.env.apiUrl}/my/photos`;

  interface DataProps {
    category: string;
    published: boolean;
    previewId: string;
    thumbnailId: string;
  }

  interface StateInterface {
    activeTab: string;
    data: DataProps[];
  }

  const [state, setState] = useState<StateInterface>({
    activeTab: 'All',
    data: [],
  });

  useEffect(() => {
    const getMyPhotos = async () => {
      const response = await GetMyPhotos(apiEndpoint);
      setState((prev) => ({ ...prev, data: response.myPhotos }));
    };
    getMyPhotos();
  }, [global.display.modal]);

  const { data, activeTab } = state;

  const makeTabs = (dataToCount: DataProps[]) => {
    return dataToCount.reduce(
      (reducedData: Array<{ category: string; total: number }>, v) => {
        const f = reducedData.find((i) => i.category === v.category);
        if (f) f.total++;
        else reducedData.push({ category: v.category, total: 1 });
        return reducedData;
      },
      []
    );
  };

  const generateTabs = () => {
    const tabs = makeTabs(data);
    const arr = [];
    for (let i = 0; i < tabs.length; i++) {
      arr.push(
        <div
          key={i}
          className='grid--tab'
          id={tabs[i].category}
          onClick={changeTab}
          style={tabOn(tabs[i].category)}
        >
          {tabs[i].category} <small>({tabs[i].total})</small>
        </div>
      );
    }
    return arr;
  };

  const changeTab = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    setState((prev) => ({ ...prev, activeTab: id }));
  };

  const tabOn = (tab: string) => {
    const on = {
      backgroundColor: 'rgb(255,255,255)',
      borderBottom: 'none',
    };
    const off = {
      backgroundColor: 'rgb(235, 236, 237)',
      borderBottom: '1px solid rgb(187, 188, 190)',
    };
    if (tab === activeTab) return on;
    else return off;
  };

  const sortByMe = (event: React.MouseEvent<HTMLElement>) => {
    const { id } = event.currentTarget;
    // dont sort within the data we have, get new data!!
  };

  const openPhotoModal = () => {
    dispatch({ type: SET_MODAL, value: 'photo' });
  };

  const bgImage = (imageUrl: string) => {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      height: '90px',
      width: '90px',
    };
  };
  const getRows = () => {
    if (activeTab === 'All' && data.length <= 0) {
      return <div> You have no photos</div>;
    } else {
      const arr = [];
      let filteredData;
      if (activeTab !== 'All') {
        filteredData = data.filter(
          (dataToFilter) => dataToFilter.category === activeTab
        );
      } else {
        filteredData = data;
      }
      for (let i = 0; i <= filteredData.length; i++) {
        if (filteredData[i]) {
          arr.push(
            <React.Fragment>
              <div
                style={bgImage(global.env.imgUrl + filteredData[i].thumbnailId)}
              ></div>
            </React.Fragment>
          );
        }
      }
      return arr;
    }
  };

  return (
    <div className='photos'>
      <div className='grid'>
        <div
          className='grid--tab'
          id='All'
          onClick={changeTab}
          style={tabOn('All')}
        >
          All <small>({Object.keys(data).length})</small>
        </div>
        <div className='grid--tab-area'>{generateTabs()}</div>
        <div className='grid--blank'></div>
        <div className='grid--blank'>
          <button color='primary' onClick={openPhotoModal}>
            Add Photo
          </button>
        </div>
        <div className='grid--body'>
          <div className='grid--header'>Preview</div>
          <div className='grid--header' id='Category' onClick={sortByMe}>
            Category
          </div>
          <div className='grid--header' id='Published' onClick={sortByMe}>
            Published
          </div>
          <div className='grid--header' id='Date' onClick={sortByMe}>
            Date
          </div>
          <div className='grid--row'>{getRows()}</div>
        </div>
      </div>
    </div>
  );
};

export { Photos };
