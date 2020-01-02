import React from 'react';

const Photos: React.FC = () => {
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
