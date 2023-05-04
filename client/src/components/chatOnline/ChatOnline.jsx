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
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [onlineUsers, friends]);

  const handleClick = async (friend) => {
    try {
      const res = await axios.get(
        `/conversations/find/${currentId}/${friend._id}`
      );
      setCurrentChat(res.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return onlineFriends.map((o) => (
    <div onClick={() => handleClick(o)} key={o._id} className='chatOnline'>
      <div className='chatOnlineFriend'>
        <div className='chatOnlineImgContainer'>
          <img
            className='chatOnlineImg'
            src={
              o?.profilePicture
                ? PF + o.profilePicture
                : PF + 'person/noAvatar.png'
            }
            // src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
            alt=''
          />
          <div className='chatOnlineBadge'></div>
        </div>
        <div className='chatOnlineName'>{o.username}</div>
      </div>
    </div>
  ));
}
