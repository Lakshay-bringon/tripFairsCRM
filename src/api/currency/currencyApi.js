import API from "../axios";

// Helper to flatten error messages
function flattenErrorMessages(error) {
	if (!error) return [];
	if (typeof error === "string") return [error];
	if (Array.isArray(error)) return error.flatMap(flattenErrorMessages);
	if (typeof error === "object") {
		return Object.values(error).flatMap(flattenErrorMessages);
	}
	return [String(error)];
}

// Get active currency list
export const activeCurrencyListApi = async () => {
	try {
		const res = await API.get("/activCurrencyList");
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch active currencies");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch active currencies";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Add a new currency
export const addCurrencyApi = async (currency) => {
	try {
		const res = await API.post("/addCurrency", { currency });
		const { status, msg, data } = res.data;
		if (status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to add currency");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to add currency";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Update an existing currency
export const updateCurrencyApi = async ({ id, currency }) => {
	try {
		const res = await API.post("/updateCurrency", { id, currency });
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update currency");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update currency";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Delete a currency by id
export const deleteCurrencyApi = async (id) => {
	try {
		const res = await API.get("/deleteCurrency", { params: { id } });
		const { status, msg } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to delete currency");
		}
		return true;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to delete currency";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Get a currency by id
export const getCurrencyApi = async (id) => {
	try {
		const res = await API.get(`/getCurrency/${id}`);
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch currency");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch currency";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Toggle currency status by id
export const toggleCurrencyStatusApi = async (id) => {
	try {
		const res = await API.get("/toggleCurrencyStatus", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to toggle currency status");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to toggle currency status";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Get the list of all currencies
export const getCurrencyListApi = async () => {
	try {
		const res = await API.get("/getCurrencyList");
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch currency list");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch currency list";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};
