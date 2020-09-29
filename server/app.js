const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const { addUser, removeUser, getUser, getAllUsersInRoom, leaveAllRooms } = require('./actions/userActions');
const { addRoom, removeRoom, getRoom } = require('./actions/roomActions');

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
  NEW_USER_JOINED,
  SET_HOST,
  SET_NEW_HOST,
  NOTIFY_CLIENT,
  GET_PLAYLIST,
  ADD_TO_PLAYLIST,
  REMOVE_FROM_PLAYLIST,
  GET_USERS
} = require('./SocketActions');

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', (socket) => {

  const sendClientNotification = (message) => {
    socket.emit(NOTIFY_CLIENT, message);
  };
  
  socket.on(JOIN, ({ username, roomId }) => {
    const { user } = addUser({ id: socket.id, username, roomId });
    
    leaveAllRooms(socket);
    socket.join(user.roomId);
    socket.roomId = user.roomId;
    
    io.in(user.roomId).emit(MESSAGE, {
      type: 'SERVER_USER-JOINED',
      content: `${user.username} joined the room. 👋`
    });
    
    socket.to(user.roomId).emit(NEW_USER_JOINED);
    
    const users = getAllUsersInRoom(user.roomId);
    
    const room = getRoom(socket.roomId);
    if (!room) addRoom({ id: user.roomId, users });
    const { host } = getRoom(socket.roomId);

    io.in(user.roomId).emit(SET_HOST, host);
    io.in(user.roomId).emit(GET_USERS, users);
  });

  socket.on(SET_NEW_HOST, (newHost) => {

    const user = getUser(newHost);
    const room = getRoom(socket.roomId);

    if (socket.id === room.host) {
      room.host = newHost;
      io.in(user.roomId).emit(SET_HOST, room.host);
      io.in(user.roomId).emit(MESSAGE, {
        type: 'NEW_HOST',
        content: `${user.username} is now the host. 👑`
      });
    };
  });

  socket.on(PLAY, () => {
    //const room = getRoom(socket.roomId);

    //if (socket.id !== room.host) return;
    
    const user = getUser(socket.id);
    socket.to(user.roomId).emit(PLAY);
  });

  socket.on(PAUSE, () => {
    //const room = getRoom(socket.roomId);

    //if (socket.id !== room.host) return;
    
    const user = getUser(socket.id);
    socket.to(user.roomId).emit(PAUSE);    
  });

  socket.on(SYNC_TIME, (currentTime) => {
    const user = getUser(socket.id);
    socket.to(user.roomId).emit(SYNC_TIME, currentTime);
  });

  socket.on(NEW_VIDEO, (videoURL) => {

    const room = getRoom(socket.roomId);

    if (socket.id !== room.host) {
      return sendClientNotification('Only the host can change videos 😉');
    };

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

  socket.on(GET_PLAYLIST, () => {
    const room = getRoom(socket.roomId);
    socket.emit(GET_PLAYLIST, room.playlist);
  });

  socket.on(ADD_TO_PLAYLIST, (data) => {
    const room = getRoom(socket.roomId);

    const videoExist = room.playlist.find((video) => video.id === data.id);
    if (!!videoExist) return;

    room.playlist.push(data);
    io.to(socket.roomId).emit(GET_PLAYLIST, room.playlist);
  });

  socket.on(REMOVE_FROM_PLAYLIST, (data) => {
    const room = getRoom(socket.roomId);
    const playlist = room.playlist;

    const index = playlist.findIndex((video) => video.id === data);
    if (index !== -1) playlist.splice(index, 1);

    io.to(socket.roomId).emit(GET_PLAYLIST, playlist);
  });

  socket.on(SEND_MESSAGE, (data) => {
    const user = getUser(socket.id);
    io.in(user.roomId).emit(MESSAGE, { 
      username: user.username, 
      content: data.content, 
      id: socket.id 
    });
  });

  socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      const room = getRoom(socket.roomId);
      
      const userWasAdmin = socket.id === room.host;
      const users = getAllUsersInRoom(user.roomId);

      if (userWasAdmin && users.length > 0) {
        room.host = users[0].id;

        io.in(user.roomId).emit(SET_HOST, room.host);
        io.in(user.roomId).emit(MESSAGE, {
          type: 'NEW_HOST',
          content: `${users[0].username} is now the host. 👑`
        });
      } else if (users.length === 0) removeRoom(socket.roomId);
      
      if (user) {
        const users = getAllUsersInRoom(user.roomId);

        io.in(user.roomId).emit(MESSAGE, {
          type: 'SERVER_USER-LEFT',
          content: `${user.username} has left the room.`
        });

        io.in(user.roomId).emit(GET_USERS, users);
      };
    });
});

server.listen(PORT, () => console.log('Server is listening on :' + PORT));

module.exports = server;