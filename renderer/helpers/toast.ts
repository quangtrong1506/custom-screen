import { toast, TypeOptions } from 'react-toastify';

export const showToast = (message: string, type: TypeOptions = 'default') => {
	toast(message, { type, autoClose: 5000 });
};

export const showPromiseToast = (
	promise: Promise<unknown>,
	message?: {
		success?: string;
		error?: string;
		loading?: string;
	}
) => {
	toast.promise(promise, {
		pending: message?.loading || 'Loading...',
		success: {
			render() {
				return message?.success || 'Success';
			},
			autoClose: 5000
		},
		error: {
			render() {
				return message?.error || 'Error';
			}
		}
	});
};
