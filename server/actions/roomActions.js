const rooms = [];

const addRoom = ({ host, name, shortURLCode }) => {

    name = name.trim();

    const room = { host, name, shortURLCode, queue: [], maxRoomSize: 20 };
    rooms.push(room);

    return room;
};

const removeRoom = (id) => {
    const index = rooms.findIndex((room) => room.id === id);
    if (index !== -1) return rooms.splice(index, 1)[0];
};

const getRoomByName = (roomName) => rooms.filter((room) => room.name === roomName)[0];
const getRoomByShortURLCode = (shortURLCode) => rooms.filter((room) => room.shortURLCode === shortURLCode)[0];

module.exports = { addRoom, getRoomByName, removeRoom, getRoomByShortURLCode };