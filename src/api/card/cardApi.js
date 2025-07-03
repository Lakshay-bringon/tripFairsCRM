import API from '../axios';

// Helper to flatten error messages
function flattenErrorMessages(error) {
	if (!error) return [];
	if (typeof error === 'string') return [error];
	if (Array.isArray(error)) return error.flatMap(flattenErrorMessages);
	if (typeof error === 'object') {
		return Object.values(error).flatMap(flattenErrorMessages);
	}
	return [String(error)];
}

// Get active cards
export const activeCardsApi = async () => {
	try {
		const res = await API.get('/activeGetCard');
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === 'object') {
				errorMsg = flattenErrorMessages(msg).join(' ');
			}
			throw new Error(errorMsg || 'Failed to fetch active cards');
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === 'object') {
				errorMsg = flattenErrorMessages(errorMsg).join(' ');
			}
			errorMsg = errorMsg || 'Failed to fetch active cards';
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

export const addCardApi = async ({ card, shortName }, email, token) => {
	try {
		const res = await API.post('/addCard', {
			name: card,
			sort_name: shortName,
		});
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === 'object') {
				errorMsg = flattenErrorMessages(msg).join(' ');
			}
			throw new Error(errorMsg || 'Failed to add card');
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === 'object') {
				errorMsg = flattenErrorMessages(errorMsg).join(' ');
			}
			errorMsg = errorMsg || 'Failed to add card';
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

export const getCardListApi = async (email, token) => {
	try {
		const res = await API.get('/getCard');
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === 'object') {
				errorMsg = flattenErrorMessages(msg).join(' ');
			}
			throw new Error(errorMsg || 'Failed to fetch cards');
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === 'object') {
				errorMsg = flattenErrorMessages(errorMsg).join(' ');
			}
			errorMsg = errorMsg || 'Failed to fetch cards';
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

export const updateCardApi = async ({ id, card, shortName }, email, token) => {
	try {
		const res = await API.post(`/updateCard`, {
			id,
			name: card,
			sort_name: shortName,
		});
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === 'object') {
				errorMsg = flattenErrorMessages(msg).join(' ');
			}
			throw new Error(errorMsg || 'Failed to update card');
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === 'object') {
				errorMsg = flattenErrorMessages(errorMsg).join(' ');
			}
			errorMsg = errorMsg || 'Failed to update card';
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

export const toggleCardStatusApi = async (id) => {
	// console.log("Toggling card status for ID:", id);
	try {
		const res = await API.get(`/toggleCardStatus`, {
			params: { id },
		});
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === 'object') {
				errorMsg = flattenErrorMessages(msg).join(' ');
			}
			throw new Error(errorMsg || 'Failed to toggle card status');
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === 'object') {
				errorMsg = flattenErrorMessages(errorMsg).join(' ');
			}
			errorMsg = errorMsg || 'Failed to toggle card status';
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

export const deleteCardApi = async (id, email, token) => {
	try {
		const res = await API.get(`/deleteCard`, {
			params: { id },
		});
		const { status, msg } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === 'object') {
				errorMsg = flattenErrorMessages(msg).join(' ');
			}
			throw new Error(errorMsg || 'Failed to delete card');
		}
		return true;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === 'object') {
				errorMsg = flattenErrorMessages(errorMsg).join(' ');
			}
			errorMsg = errorMsg || 'Failed to delete card';
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};
