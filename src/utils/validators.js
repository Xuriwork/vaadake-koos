export const isEmpty = (string) => {
    if(string.trim() === '') return true;
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

export const validatePasscode = (passcode) => {
    let error = null; 
        
    passcode = passcode.trim();

    if (isEmpty(passcode)) {
        error = 'Cannot update with an empty field';
    } else if (!/^[a-zA-Z0-9_-]*$/.test(passcode)) {
        error = 'Only alphanumeric characters';
    } else if (passcode.length < 1) {
        error = 'The min character length is 1 characters';
    } else if (passcode.length > 50) {
        error = 'The max character length is 50 characters';
    };

    return error;
};