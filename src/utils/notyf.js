import { Notyf } from 'notyf';

const notyf = new Notyf({
	position: {
		x: 'right',
		y: 'top',
    },
    dismissible: true
});

export const notyfError = (message, duration) => notyf.error({ message, duration });
export const notyfSuccess = (message, duration) => notyf.success({ message, duration });