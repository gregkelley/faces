import React from 'react';
import './FaceRecognition.css';

// style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>

const FaceRecognition = ({imageUrl, box}) => {
  return (
    <div className="center ma">
      <div className='absoulte mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto' />
        <div className='bounding-box' 
            style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
    </div>
  );
}

export default FaceRecognition;