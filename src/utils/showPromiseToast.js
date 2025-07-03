import { toast } from 'react-hot-toast';

function flattenErrorMessages(error) {
	if (!error) return [];
	if (typeof error === 'string') return [error];
	if (Array.isArray(error)) return error.flatMap(flattenErrorMessages);
	if (typeof error === 'object') {
		// Handle validation errors from server
		if (error.errors && typeof error.errors === 'object') {
			const validationErrors = Object.entries(error.errors).map(
				([field, messages]) => {
					const msgArray = Array.isArray(messages) ? messages : [messages];
					return `${field}: ${msgArray.join(', ')}`;
				}
			);
			return validationErrors;
		}
		return Object.values(error).flatMap(flattenErrorMessages);
	}
	return [String(error)];
}

function formatErrorMessage(error) {
	// If error has a message property, use it directly
	if (error && typeof error === 'object' && error.message) {
		return error.message;
	}

	const messages = flattenErrorMessages(error);
	return messages.filter(Boolean).join(' ') || 'Something went wrong.';
}

export function showPromiseToast(promise, messages = {}, toastOptions = {}) {
	const {
		loading = 'Loading...',
		success = 'Success!',
		error: customErrorHandler,
	} = messages;

	const defaultOptions = {
		style: { borderRadius: '8px', backgroundColor: '#1f2937', color: '#fff' },
		duration: 3000,
	};

	return toast.promise(
		promise,
		{
			loading,
			success,
			error: (err) => {
				// If a custom error handler is provided and it's a function, use it
				if (typeof customErrorHandler === 'function') {
					return customErrorHandler(err);
				}
				// If customErrorHandler is a string, use it as fallback
				return (
					formatErrorMessage(err) ||
					customErrorHandler ||
					'Something went wrong.'
				);
			},
		},
		{ ...defaultOptions, ...toastOptions }
	);
}
