const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server);
require('dotenv').config();

const { PLAY, PAUSE, SYNC_TIME, NEW_VIDEO,
   ASK_FOR_VIDEO_INFORMATION, SYNC_VIDEO_INFORMATION,
   JOIN_ROOM, SEND_MESSAGE, RECEIVED_MESSAGE, SEND_USERNAME, ASK_FOR_USERNAME } = require('../Constants');
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', function(socket) {

  //in = send all
  //to = send all except sender

  socket.on(JOIN_ROOM, (data) => {
    socket.join(data.room);
    socket.room = data.room;
    socket.username = data.username;

    io.in(socket.room).emit(RECEIVED_MESSAGE, {
      type: 'SERVER_USER-JOINED',
      content: socket.username + " joined the room."
    });

    io.in(socket.room).emit(ASK_FOR_USERNAME);
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

  socket.on(ASK_FOR_VIDEO_INFORMATION, () => {
    socket.to(socket.room).emit(ASK_FOR_VIDEO_INFORMATION);
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

      io.in(socket.room).emit(ASK_FOR_USERNAME);
    });
  });

server.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});