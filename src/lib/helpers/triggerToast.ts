import { toastStore } from '@skeletonlabs/skeleton';

// types
import type { ToastSettings } from '@skeletonlabs/skeleton';

const t: ToastSettings = {
	message: '',
	timeout: 3000,
	autohide: true
};

export const successToast = (message: string, settings = {}) => {
	toastStore.trigger({
		...t,
		...settings,
		background: 'bg-gradient-success',
		message
	});
};
export const errorToast = (message: string, settings = {}) => {
	toastStore.trigger({
		...t,
		...settings,
		background: 'bg-gradient-error',
		message
	});
};
