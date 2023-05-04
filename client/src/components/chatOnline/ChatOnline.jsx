import React, { useEffect, useState } from 'react';
import './chatOnline.css';
import axios from 'axios';

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get('/users/friends/' + currentId);
        setFriends(res.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    getFriends();
  }, []);
  // console.log('friends:', friends);

  return onlineUsers.map((user) => (
    <div key={user._id} className='chatOnline'>
      <div className='chatOnlineFriend'>
        <div className='chatOnlineImgContainer'>
          <img
            className='chatOnlineImg'
            src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
            alt=''
          />
          <div className='chatOnlineBadge'></div>
        </div>
        <div className='chatOnlineName'>{}</div>
      </div>
    </div>
  ));
}
