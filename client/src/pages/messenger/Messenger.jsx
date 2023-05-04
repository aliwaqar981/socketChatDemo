import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import './messenger.css';
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';

export default function Messenger() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');

    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        text: data.text,
        sender: data.senderId,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get('/conversations/' + user._id);
        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('/messages/' + currentChat?._id);
        setMessages(res.data);
      } catch (error) {
        console.log('Error', error);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    // Finding user which is not current loggedIn user
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const response = await axios.post('/messages', message);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <>
      <Topbar />
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            <input placeholder='Search for friends' className='chatMenuInput' />
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => setCurrentChat(conversation)}
              >
                <Conversation conversation={conversation} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {messages.map((message, index) => (
                    <div key={message._id + index} ref={scrollRef}>
                      <Message
                        message={message}
                        own={message.sender === user._id}
                      />
                    </div>
                  ))}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='chatMessageInput'
                    placeholder='srite something...'
                    value={newMessage}
                  ></textarea>
                  <button onClick={handleSubmit} className='chatSubmitButton'>
                    {' '}
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className='noConversationText'>
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className='chatOnline'>
          <div className='chatOnlineWrapper'>
            <ChatOnline
              onlineUsers={[]}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
