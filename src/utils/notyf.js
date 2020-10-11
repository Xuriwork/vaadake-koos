import { Notyf } from 'notyf';

const notyf = new Notyf({
	position: {
		x: 'right',
		y: 'top',
    },
	dismissible: true,
	types: [
		{
			type: 'redirecting',
			background: '#364f6b',
			icon: false,
			dismissible: false,
		}
	]
});

export const notyfError = (message, duration) => notyf.error({ message, duration });
export const notyfSuccess = (message, duration) => notyf.success({ message, duration });
export const notyfRedirecting = (duration) => notyf.open({ type: 'redirecting', message: 'Redirecting...', duration });