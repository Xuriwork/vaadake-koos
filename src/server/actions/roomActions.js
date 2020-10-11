const rooms = [];

const addRoom = ({ host, name, roomCode }) => {

    name = name.trim();

    const room = { host, name, roomCode, queue: [], maxRoomSize: 20 };
    rooms.push(room);

    return room;
};

const removeRoom = (id) => {
    const index = rooms.findIndex((room) => room.id === id);
    if (index !== -1) return rooms.splice(index, 1)[0];
};

const getRoomByName = (roomName) => rooms.filter((room) => room.name === roomName)[0];
const getRoomByRoomCode = (roomCode) => rooms.filter((room) => room.roomCode === roomCode)[0];

module.exports = { addRoom, getRoomByName, removeRoom, getRoomByRoomCode };
