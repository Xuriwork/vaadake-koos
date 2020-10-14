const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bcrypt = require('bcrypt');
const shortid = require('shortid');

const { addUser, removeUser, getUser, getAllUsersInRoom } = require('./actions/userActions');
const { addRoom, removeRoom, getRoomByName, getRoomByRoomId } = require('./actions/roomActions');
const { validatePasscode, validateMaxRoomSize, validateRoomId } = require('./validators');

const {
  CHECK_IF_ROOM_REQUIRES_PASSCODE,
  GET_ROOM_CODE,
  VERIFY_PASSCODE,
  SET_ROOM_PASSCODE,
  CHANGE_ROOM_ID,
	PLAY,
  JOIN,
	PAUSE,
	SYNC_TIME,
	VIDEO_CHANGED,
	GET_VIDEO_INFORMATION,
  SYNC_VIDEO_INFORMATION,
  GET_HOST_TIME,
  SYNC_WITH_HOST,
	SEND_MESSAGE,
	MESSAGE,
  NEW_USER_JOINED,
  SET_HOST,
  SET_NEW_HOST,
  NOTIFY_CLIENT_SUCCESS,
	NOTIFY_CLIENT_ERROR,
  GET_QUEUE,
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
  GET_USERS,
  SET_MAX_ROOM_SIZE,
  CHECK_IF_ROOM_IS_FULL,
  GET_SHORT_URL,
  SYNC_BUTTON,
} = require('../SocketActions');

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', (socket) => {

  const sendClientUnsuccessNotification = (message) => {
    socket.emit(NOTIFY_CLIENT_ERROR, message);
  };  

  const sendClientSuccessNotification = (message) => {
    socket.emit(NOTIFY_CLIENT_SUCCESS, message);
  };

  socket.on(CHECK_IF_ROOM_IS_FULL, (roomName, callback) => {
    const room = getRoomByName(roomName);

    if (room && room.numberOfUsers === room.maxRoomSize) {
      return callback(true);
    };
    callback(false);
  });

  socket.on(CHECK_IF_ROOM_REQUIRES_PASSCODE, (roomName, callback) => {
    const room = getRoomByName(roomName);
    
    if (room && room.passcode) {
      return callback(true);
    };

    callback(false);
  });

  socket.on(VERIFY_PASSCODE, ({ roomName, passcode }, callback) => {
    if (!passcode) return;
    
    const room = getRoomByName(roomName);

    bcrypt.compare(passcode, room.passcode)
    .then((result) => {
      if (result === true) return callback(true);
      callback(false);
    });
  });

  socket.on(GET_SHORT_URL, (roomId, callback) => {
    const room = getRoomByRoomId(roomId);

    if (room && room.name) return callback(true, room.name);
    callback(false, null);
  });

  socket.on(JOIN, ({ username, roomName }) => {
    const room = getRoomByName(roomName);

    const { user } = addUser({ id: socket.id, username, roomName });

    socket.leaveAll();
    socket.join(user.roomName);
    
    socket.roomName = user.roomName;
    
    io.in(user.roomName).emit(MESSAGE, {
      type: 'SERVER-USER_JOINED',
      content: `${user.username} joined the room. 👋`
    });
    
    socket.to(user.roomName).emit(NEW_USER_JOINED);
    
    const users = getAllUsersInRoom(user.roomName);
    if (!room) addRoom({ name: user.roomName, host: users[0].id, roomId: shortid.generate() });

    const { host } = getRoomByName(user.roomName);

    socket.emit(SET_HOST, host);
    io.in(user.roomName).emit(GET_USERS, users);

    const { maxRoomSize, roomId } = getRoomByName(socket.roomName);
    io.in(user.roomName).emit('GET_ROOM_INFO', { maxRoomSize, roomId });
  });

  socket.on(GET_ROOM_CODE, () => {
    const room = getRoomByName(socket.roomName);
    socket.emit(GET_ROOM_CODE, room.roomId);
  });

  socket.on(SET_NEW_HOST, (newHost) => {
    const user = getUser(newHost);
    const room = getRoomByName(socket.roomName);

    if (socket.id === room.host) {
      room.host = newHost;
      io.in(user.roomName).emit(SET_HOST, room.host);
      io.in(user.roomName).emit(MESSAGE, {
        type: 'NEW_HOST',
        content: `${user.username} is now the host. 👑`
      });
    };
  });

  socket.on(PLAY, () => {
    const room = getRoomByName(socket.roomName);
    if (room.host !== socket.id) return;

    const user = getUser(socket.id);
    socket.to(user.roomName).emit(PLAY);
  });

  socket.on(PAUSE, () => {
    const room = getRoomByName(socket.roomName);
    if (room.host !== socket.id) return;

    const user = getUser(socket.id);
    socket.to(user.roomName).emit(PAUSE);    
  });

  socket.on(SYNC_BUTTON, (callback) => {
    const room = getRoomByName(socket.roomName);
    io.sockets.connected[room.host].emit(GET_HOST_TIME, (time) => callback(time));
  });

  socket.on(SYNC_WITH_HOST, () => {
    const room = getRoomByName(socket.roomName);
    io.sockets.connected[room.host].emit(SYNC_WITH_HOST);
  });

  socket.on(SYNC_TIME, (currentTime) => {
    const user = getUser(socket.id);
    socket.to(user.roomName).emit(SYNC_TIME, currentTime);
  });

  socket.on(SYNC_VIDEO_INFORMATION, (data) => {
    const user = getUser(socket.id);
    io.to(user.roomName).emit(SYNC_VIDEO_INFORMATION, data);
  });

  socket.on(GET_VIDEO_INFORMATION, () => {
    const user = getUser(socket.id);
    socket.to(user.roomName).emit(GET_VIDEO_INFORMATION);
  });

  socket.on(VIDEO_CHANGED, (videoURL) => {

    const room = getRoomByName(socket.roomName);

    if (socket.id !== room.host) {
      return sendClientUnsuccessNotification('Only the host can change videos 😉');
    };

    io.to(socket.roomName).emit(VIDEO_CHANGED, videoURL);
  });

  socket.on(GET_QUEUE, () => {
    const room = getRoomByName(socket.roomName);
    socket.emit(GET_QUEUE, room.queue);
  });

  socket.on(ADD_TO_QUEUE, (data) => {
    const room = getRoomByName(socket.roomName);

    const videoExist = room.queue.find((video) => video.id === data.id);
    if (!!videoExist) return;

    room.queue.push(data);
    io.to(socket.roomName).emit(GET_QUEUE, room.queue);
  });

  socket.on(REMOVE_FROM_QUEUE, (data) => {
    const room = getRoomByName(socket.roomName);
    const queue = room.queue;

    const index = queue.findIndex((video) => video.id === data);
    if (index !== -1) queue.splice(index, 1);

    io.to(socket.roomName).emit(GET_QUEUE, queue);
  });

  socket.on(SEND_MESSAGE, (data) => {
    const user = getUser(socket.id);
    io.in(user.roomName).emit(MESSAGE, { 
      username: user.username, 
      content: data.content, 
      id: socket.id 
    });
  });

  socket.on(CHANGE_ROOM_ID, (newRoomId, callback) => {
    const room = getRoomByName(socket.roomName);
    if (socket.id !== room.host) return;

    const { valid, error } = validateRoomId(newRoomId);
    if (!valid) return sendClientUnsuccessNotification(error);

    room.id = newRoomId;
    callback(true, 'Room Id successfully changed');

    io.in(room.name).emit('GET_ROOM_INFO', { maxRoomSize: room.maxRoomSize, roomId: room.roomId });
  });

  socket.on(SET_ROOM_PASSCODE, (passcode) => {
    const room = getRoomByName(socket.roomName);
    if (socket.id !== room.host) return;

    const { valid, error } = validatePasscode(passcode);
    if (!valid) return sendClientUnsuccessNotification(error);

    if (passcode.length > 50) {
      return sendClientUnsuccessNotification('Room Passcode can only be up to 50 characters');
    };
    
    bcrypt.hash(passcode, 10)
    .then((hash) => {
      room.passcode = hash;
      sendClientSuccessNotification('Passcode successfully set');
    })
    .catch((error) => console.error('Error generating a hash: ', error));
  });

  socket.on(SET_MAX_ROOM_SIZE, (newMaxRoomSize) => {
    const room = getRoomByName(socket.roomName);
    const users = getAllUsersInRoom(socket.roomName);
    if (socket.id !== room.host) return;

    const { valid, error } = validateMaxRoomSize(newMaxRoomSize, users.length);
    if (!valid) return sendClientUnsuccessNotification(error);

    room.maxRoomSize = newMaxRoomSize;
    io.in(room.name).emit('GET_ROOM_INFO', { maxRoomSize: room.maxRoomSize, roomId: room.roomId });
    sendClientSuccessNotification('Room settings saved successfully');
  });

  socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      if (user) {
        const room = getRoomByName(socket.roomName);

				const userWasAdmin = socket.id === room.host;
				const users = getAllUsersInRoom(user.roomName);

				if (userWasAdmin && users.length > 0) {
					room.host = users[0].id;

					io.in(user.roomName).emit(SET_HOST, room.host);
					io.in(user.roomName).emit(MESSAGE, {
						type: 'NEW_HOST',
						content: `${users[0].username} is now the host. 👑`,
					});
				} else if (users.length === 0) {
					removeRoom(socket.roomName);
				}

				io.in(user.roomName).emit(MESSAGE, {
					type: 'SERVER_USER-LEFT',
					content: `${user.username} has left the room.`,
				});

				io.in(user.roomName).emit(GET_USERS, users);
      };
    });
});

server.listen(PORT, () => console.log('Server is listening on: ' + PORT));