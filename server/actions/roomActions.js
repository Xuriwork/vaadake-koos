const rooms = [];

const addRoom = ({ host, id, users }) => {

    id = id.trim();

    if (!host) host = users[0].id;
    const room = { host, id, numberOfUsers: users.length };
    rooms.push(room);

    console.log('rooms', rooms);

    return { room };
};


const getRoom = (roomId) => rooms.filter((room) => room.id === roomId)[0];

module.exports = { addRoom, getRoom };
