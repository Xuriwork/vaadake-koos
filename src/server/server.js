const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server);

const {
	PLAY,
	PAUSE,
	SYNC_TIME,
	NEW_VIDEO,
	GET_VIDEO_INFORMATION,
	SYNC_VIDEO_INFORMATION,
	JOIN_ROOM,
	SEND_MESSAGE,
	RECEIVED_MESSAGE,
	SEND_USERNAME,
	GET_USERNAME,
} = require('../Commands');
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', function(socket) {

  socket.on(JOIN_ROOM, (data) => {
    socket.join(data.roomId);
    socket.room = data.roomId;
    socket.username = data.username;

    io.in(socket.room).emit(RECEIVED_MESSAGE, {
      type: 'SERVER_USER-JOINED',
      content: socket.username + " joined the room."
    });

    io.in(socket.room).emit(GET_USERNAME);
  });
  
  socket.on(PLAY, () => {
    socket.to(socket.room).emit(PLAY);
  });

  socket.on(PAUSE, () => {
    socket.to(socket.room).emit(PAUSE);    
  });

  socket.on(SYNC_TIME, (currentTime) => {
    socket.to(socket.room).emit(SYNC_TIME, currentTime);
  });

  socket.on(NEW_VIDEO, (videoURL) => {
    io.to(socket.room).emit(NEW_VIDEO, videoURL);
  });

  socket.on(GET_VIDEO_INFORMATION, () => {
    socket.to(socket.room).emit(GET_VIDEO_INFORMATION);
  });

  socket.on(SYNC_VIDEO_INFORMATION, (data) => {
    io.to(socket.room).emit(SYNC_VIDEO_INFORMATION, data);
  });

  socket.on(SEND_MESSAGE, (data) => {
    io.in(socket.room).emit(RECEIVED_MESSAGE, { username: socket.username, content: data.content });
  });

  socket.on(SEND_USERNAME, (username) => {
    io.in(socket.room).emit(SEND_USERNAME, username);
  });

  socket.on('disconnect', () => {
      socket.in(socket.room).emit(RECEIVED_MESSAGE, {
        type: 'SERVER_USER-LEFT',
        content: socket.username + " disconnected."
      });

      io.in(socket.room).emit(GET_USERNAME);
    });
  });

server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});