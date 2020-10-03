const users = [];

const addUser = ({ id, username, roomId, leave }) => {

    username = username.trim();
    roomId = roomId.trim();

    const user = { id, username, roomId, leave };
    users.push(user);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);
const getAllUsersInRoom = (roomId) => users.filter((user) => user.roomId === roomId);

const leaveAllRooms = (socket) => {
	const rooms = socket.adapter.sids[socket.id];
	Object.keys(rooms).forEach((room) => {
		if (room !== socket.id) socket.leave(room);
	});
};

module.exports = { addUser, removeUser, getUser, getAllUsersInRoom, leaveAllRooms };