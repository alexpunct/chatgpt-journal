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
		background: 'bg-gradient-to-tr from-success-900 via-success-700 to-success-500 text-black',
		message
	});
};
export const errorToast = (message: string, settings = {}) => {
	toastStore.trigger({
		...t,
		...settings,
		background: 'bg-gradient-to-tr from-error-900 via-error-700 to-error-500',
		message
	});
};
