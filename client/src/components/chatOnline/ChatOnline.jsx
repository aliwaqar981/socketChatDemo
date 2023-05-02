import React from 'react';
import './chatOnline.css';

export default function ChatOnline() {
  return (
    <div className='chatOnline'>
      <div className='chatOnlineFriend'>
        <div className='chatOnlineImgContainer'>
          <img
            className='chatOnlineImg'
            src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
            alt=''
          />
          <div className='chatOnlineBadge'></div>
        </div>
        <div className='chatOnlineName'>John Doe</div>
      </div>
    </div>
  );
}
