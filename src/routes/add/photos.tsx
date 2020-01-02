import React from 'react';

const Photos: React.FC = () => {

  // TODO: onload get the dtata from the api and pipe it into body, add alternating background colors
  const data = [
    { category: 'Double Deckers', busNumber: 102, country: 'United Kingdom', published: true },
    { category: 'Double Deckers', busNumber: 973, country: 'United Kingdom', published: true },
    { category: 'Double Deckers', busNumber: 814, country: 'United Kingdom', published: true },
    { category: 'Double Deckers', busNumber: 7734, country: 'United Kingdom', published: true },
    { category: 'Single Deckers', busNumber: 104, country: 'China', published: true },
    { category: 'Single Deckers', busNumber: 496, country: 'China', published: true },
    { category: 'Single Deckers', busNumber: 80, country: 'China', published: true },
    { category: 'Single Deckers', busNumber: 712, country: 'China', published: true },
  ];

  interface CountProps {
    category: string;
    busNumber: number;
    country: string;
    published: boolean;
  }

  const count = (dataToCount: CountProps[]) => {
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
  // const summary = count(data);

  const sort = (
    dataToSort: CountProps[],
    onlyShow: string,
    sortBy: keyof CountProps,
    ascDesc: -1 | 1
  ) => {
    if (onlyShow !== 'any') {
      dataToSort
        .filter((v) => v.category === onlyShow)
        .sort((a, b) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          if (typeof aValue === 'string') {
            aValue = aValue.toLocaleUpperCase();
          }
          if (typeof bValue === 'string') {
            bValue = bValue.toLocaleUpperCase();
          }
          if (aValue < bValue) return ascDesc;
          if (aValue > bValue) return ascDesc * -1;
          return 0;
        });
    }
  };
  // const sortedData = sort(data, 'Double Deckers', 'country', -1);

  return (
    <div className='photos'>
      <div className='grid'>
        <div className='grid--tab grid--selected'>
          All <small>(3000)</small>
        </div>
        <div className='grid--tab'>
          Double Deckers <small>(3000)</small>
        </div>
        <div className='grid--tab'>
          Single Deckers <small>(3000)</small>
        </div>
        <div className='grid--tab'>
          Midi'd <small>(3000)</small>
        </div>
        <div className='grid--tab'>
          Mini's <small>(3000)</small>
        </div>
        <div className='grid--tab'>
          Coaches <small>(3000)</small>
        </div>
        <div className='grid--blank'></div>
        <div className='grid--blank'>
          <button color='primary'>Add Photo</button>
        </div>
        <div className='grid--body'>
          <div className='grid--header'>Preview</div>
          <div className='grid--header'>Published</div>
          <div className='grid--header'>Number</div>
          <div className='grid--header'>Licence</div>
          <div className='grid--header'>Country</div>
          <div className='grid--header'>Date</div>
          <div className='grid--row'>
            <div>body</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Photos };
