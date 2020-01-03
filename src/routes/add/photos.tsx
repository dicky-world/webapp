import React, { useContext, useState } from 'react';
import { Global } from '../../globalState';
import { Dispatch, SET_MODAL } from '../../globalState';

const Photos: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);

  const [state, setState] = useState({
    activeTab: 'All',
    data: [
      {
        busNumber: 102,
        category: 'Double Deckers',
        country: 'United Kingdom',
        published: true,
      },
      {
        busNumber: 973,
        category: 'Double Deckers',
        country: 'United Kingdom',
        published: true,
      },
      {
        busNumber: 814,
        category: 'Double Deckers',
        country: 'United Kingdom',
        published: true,
      },
      {
        busNumber: 7734,
        category: 'Double Deckers',
        country: 'United Kingdom',
        published: true,
      },
      {
        busNumber: 104,
        category: 'Single Deckers',
        country: 'China',
        published: true,
      },
      {
        busNumber: 496,
        category: 'Single Deckers',
        country: 'China',
        published: true,
      },
      {
        busNumber: 80,
        category: 'Single Deckers',
        country: 'China',
        published: true,
      },
      {
        busNumber: 712,
        category: 'Single Deckers',
        country: 'China',
        published: true,
      },
    ],
  });
  const { data, activeTab } = state;

  // TODO: onload get the dtata from the api and pipe it into body, add alternating background colors
  interface CountProps {
    category: string;
    busNumber: number;
    country: string;
    published: boolean;
  }

  const makeTabs = (dataToCount: CountProps[]) => {
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
  //  const summary = makeTabs(data);

  const sortGrid = (
    dataToSort: CountProps[],
    onlyShow: string
    // sortBy: keyof CountProps,
    // ascDesc: -1 | 1
  ) => {
    if (onlyShow !== 'any') {
      dataToSort
        .filter((dataToFilter) => dataToFilter.category === onlyShow);
        // .sort((a, b) => {
        //   let aValue = a[sortBy];
        //   let bValue = b[sortBy];
        //   if (typeof aValue === 'string') {
        //     aValue = aValue.toLocaleUpperCase();
        //   }
        //   if (typeof bValue === 'string') {
        //     bValue = bValue.toLocaleUpperCase();
        //   }
        //   if (aValue < bValue) return ascDesc;
        //   if (aValue > bValue) return ascDesc * -1;
        //   return 0;
        // });
    }
  };
  // const sortedData = sortGrid(data, 'Double Deckers', 'country', -1);

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
          <button color='primary' onClick={openPhotoModal}>Add Photo</button>
        </div>
        <div className='grid--body'>
          <div className='grid--blank-header'>Preview</div>
          <div className='grid--header' id='Date' onClick={sortByMe}>Date</div>
          <div className='grid--header' id='Published' onClick={sortByMe}>Published</div>
          <div className='grid--header' id='Number' onClick={sortByMe}>Number</div>
          <div className='grid--header' id='Licence' onClick={sortByMe}>Licence</div>
          <div className='grid--header' id='Country' onClick={sortByMe}>Country</div>
          <div className='grid--row'>
            <div>body</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Photos };
