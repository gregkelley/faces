import React from 'react';

const Rank = ({name, entries}) => {
  return (
    <div>
      <div className='white f3'>
        {`${name}, your current image count is...`}
      </div>
      <div className='white f1'>
        {entries}
      </div>
      <div className='white f3'>
        {'any lower and we will just change your rank to: Suck'}
      </div>
    </div>
  )
}

export default Rank;