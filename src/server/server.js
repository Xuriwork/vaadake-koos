const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server);
const { addUser, removeUser, getUser, getAllUsersInRoom, leaveAllRooms } = require('./userActions');

const {
	PLAY,
  JOIN,
	PAUSE,
	SYNC_TIME,
	NEW_VIDEO,
	GET_VIDEO_INFORMATION,
	SYNC_VIDEO_INFORMATION,
	SEND_MESSAGE,
	MESSAGE,
	GET_ROOM_DATA,
  NEW_USER_JOINED,
  SET_HOST,
  SET_NEW_HOST
} = require('../Commands');
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', (socket) => {

  socket.on(JOIN, ({ username, roomId }) => {
    const { user } = addUser({ id: socket.id, username, roomId });

    leaveAllRooms(socket);
    socket.join(user.roomId);
    
    io.in(user.roomId).emit(MESSAGE, {
      type: 'SERVER_USER-JOINED',
      content: `${user.username} joined the room.`
    });

    socket.to(user.roomId).emit(NEW_USER_JOINED);

    const users = getAllUsersInRoom(user.roomId);

    if (users.length === 1 || !socket.host) {
      socket.host = users[0].id
    };

    io.in(user.roomId).emit(SET_HOST, socket.host);
    io.in(user.roomId).emit(GET_ROOM_DATA, { roomId: user.roomId, users });
  });

  socket.on(SET_NEW_HOST, (newHost) => {

    const user = getUser(newHost);

    if (socket.id === socket.host) {
      socket.host = newHost;
      io.in(user.roomId).emit(SET_HOST, socket.host);
      io.in(user.roomId).emit(MESSAGE, {
        type: 'NEW_HOST',
        content: `${user.username} is now the host.`
      });
    };
  });

  socket.on(PLAY, () => {
    const user = getUser(socket.id);
    socket.to(user.roomId).emit(PLAY);
  });

  socket.on(PAUSE, () => {
    const user = getUser(socket.id);
    socket.to(user.roomId).emit(PAUSE);    
  });

  socket.on(SYNC_TIME, (currentTime) => {
    const user = getUser(socket.id);
    socket.to(user.roomId).emit(SYNC_TIME, currentTime);
  });

  socket.on(NEW_VIDEO, (videoURL) => {
    const user = getUser(socket.id);
    io.to(user.roomId).emit(NEW_VIDEO, videoURL);
  });

  socket.on(GET_VIDEO_INFORMATION, () => {
    const user = getUser(socket.id);
    socket.to(user.roomId).emit(GET_VIDEO_INFORMATION);
  });

  socket.on(SYNC_VIDEO_INFORMATION, (data) => {
    const user = getUser(socket.id);
    io.to(user.roomId).emit(SYNC_VIDEO_INFORMATION, data);
  });

  socket.on(SEND_MESSAGE, (data) => {
    const user = getUser(socket.id);
    io.in(user.roomId).emit(MESSAGE, { username: user.username, content: data.content });
  });

  socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      const userWasAdmin = socket.id === socket.host;

      const users = getAllUsersInRoom(user.roomId);

      if (userWasAdmin && users.length > 0) {
        socket.host = users[0].id;
        io.in(user.roomId).emit(SET_HOST, socket.host);
        io.in(user.roomId).emit(MESSAGE, {
          type: 'NEW_HOST',
          content: `${users[0].username} is now the host.`
        });
      };
      
      if (user) {
        const users = getAllUsersInRoom(user.roomId);

        io.in(user.roomId).emit(MESSAGE, {
          type: 'SERVER_USER-LEFT',
          content: `${user.username} has left the room.`
        });

        io.in(user.roomId).emit(GET_ROOM_DATA, { roomId: user.roomId, users });
      };
    });
});

server.listen(PORT, () => console.log('Server is listening on :' + PORT));