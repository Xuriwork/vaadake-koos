export const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
};	

export const validateJoinRoomData = (username, roomName) => {
    const errors = {};
        
    const trimmedUsername = username.replace(' ', '');
    const trimmedRoomName = roomName.replace(' ', '');

    if (isEmpty(username)) {
        errors.username = 'This field is required';
    } else if (!/^[a-zA-Z0-9_-]*$/.test(trimmedUsername)) {
        errors.username = 'Only alphanumeric characters';
    } else if (trimmedUsername.length < 1) {
        errors.username = 'The min character length is 1 characters';
    } else if (trimmedUsername.length > 50) {
        errors.username = 'The max character length is 50 characters';
    };

    if (isEmpty(roomName)) {
        errors.roomName = 'This field is required';
    } else if (!/^[a-zA-Z0-9_-]*$/.test(trimmedRoomName)) {
        errors.roomName = 'Only alphanumeric characters';
    } else if (trimmedRoomName.length < 1) {
        errors.roomName = 'The min character length is 1 characters';
    } else if (trimmedRoomName.length > 150) {
        errors.roomName = 'The max character length is 150 characters';
    };

    const valid = Object.keys(errors).length === 0 ? true : false;

    return { errors, valid };
};

export const validateSettings = ({ passcode, maxRoomSize, currentNumberOfUsers, roomId }) => {
    const errors = {};

    console.log(passcode, maxRoomSize, currentNumberOfUsers, roomId);

    if (passcode) {
        passcode = passcode.trim();

        if (isEmpty(passcode)) {
            errors.passcode = 'Cannot update with an empty field';
        } else if (!/^[a-zA-Z0-9_-]*$/.test(passcode)) {
            errors.passcode = 'Only alphanumeric characters';
        } else if (passcode.length < 1) {
            errors.passcode = 'The minimum character length is 1';
        } else if (passcode.length > 50) {
            errors.passcode = 'The maximum character length is 50';
        };
    }

    if (maxRoomSize) {
        if (!maxRoomSize) {
            errors.maxRoomSize = 'Cannot update with an empty field';
        } else if (!/^[0-9]*$/.test(maxRoomSize)) {
            errors.maxRoomSize = 'Only numeric characters';
        } else if (maxRoomSize < currentNumberOfUsers) {
            errors.maxRoomSize = `The amount of current users (${currentNumberOfUsers}) is higher than the amount you are trying to change to`;
        } else if (maxRoomSize < 1) {
            errors.maxRoomSize = 'Minimum room size is 1';
        } else if (maxRoomSize > 20) {
            errors.maxRoomSize = 'Max room size cannot overpass 20.';
        };
    }

    if (roomId) {
        if (isEmpty(roomId)) {
            errors.roomId = 'Cannot update with an empty field';
        } else if (!/^[a-zA-Z0-9_-]*$/.test(roomId)) {
            errors.roomId = 'Only alphanumeric characters';
        } else if (roomId.length < 5) {
            errors.roomId = 'The minimum character length is 5';
        } else if (roomId.length > 50) {
            errors.roomId = 'The maximum character length is 50';
        };
    }

    const valid = Object.keys(errors).length === 0 ? true : false;

    return { errors, valid };
};