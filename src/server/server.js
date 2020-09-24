const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server);
const { addUser, removeUser, getUser, getAllUsersInRoom } = require('./userActions');

const {
	PLAY,
  USER_JOINED,
	PAUSE,
	SYNC_TIME,
	NEW_VIDEO,
	GET_VIDEO_INFORMATION,
	SYNC_VIDEO_INFORMATION,
	SEND_MESSAGE,
	MESSAGE,
	GET_ROOM_DATA,
  NEW_USER_JOINED,
} = require('../Commands');
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', (socket) => {

  socket.on(USER_JOINED, ({ username, roomId }) => {
    
    const { user } = addUser({ id: socket.id, username, roomId });

    socket.join(user.roomId);
    
    io.in(user.roomId).emit(MESSAGE, {
      type: 'SERVER_USER-JOINED',
      content: user.username + " joined the room."
    });

    socket.to(user.roomId).emit(NEW_USER_JOINED);

    const users = getAllUsersInRoom(user.roomId);


    io.in(user.roomId).emit(GET_ROOM_DATA, { roomId: user.roomId, users });
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
      
      if (user) {
        const users = getAllUsersInRoom(user.roomId);

        io.in(user.roomId).emit(MESSAGE, {
          type: 'SERVER_USER-LEFT',
          content: user.username + " disconnected."
        });

        io.in(user.roomId).emit(GET_ROOM_DATA, { roomId: user.roomId, users });
      }
    });
  });

server.listen(PORT, () => console.log('Server is listening on :' + PORT));