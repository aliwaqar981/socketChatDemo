// Helping Cheatsheet
// https://socket.io/docs/v4/emit-cheatsheet

const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId == userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('a user connnected');

  // To send message to all connected users
  // io.emit('welcome', 'hello this is socket server');

  // To send message to specific socket
  // io.to(socketId).emit('welcome', 'hello this is socket server');

  // when connect
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit('getMessage', {
      senderId,
      text,
    });
  });

  // when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
