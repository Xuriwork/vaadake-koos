const users = [];

const addUser = ({ id, username, roomId }) => {

    username = username.trim();
    roomId = roomId.trim();

    const user = { id, username, roomId };
    users.push(user);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);
const getAllUsersInRoom = (roomId) => users.filter((user) => user.roomId === roomId);

module.exports = { addUser, removeUser, getUser, getAllUsersInRoom };