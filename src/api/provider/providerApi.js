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

// Get active providers
export const activeProvidersApi = async () => {
	try {
		const res = await API.get("/activeProviders");
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch active providers");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch active providers";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Add a new provider
export const addProviderApi = async (providerData) => {
	try {
		const res = await API.post("/addProvider", providerData);
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to add provider");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to add provider";

			const errorDetails = err.response.data?.errors;
			if (errorDetails && typeof errorDetails === "object") {
				// Handle validation errors from server
				const validationErrors = Object.entries(errorDetails)
					.map(
						([field, messages]) =>
							`${field}: ${
								Array.isArray(messages) ? messages.join(", ") : messages
							}`
					)
					.join("; ");
				throw new Error(validationErrors);
			}
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Update an existing provider
export const updateProviderApi = async (providerData) => {
	try {
		const res = await API.post("/updateProvider", providerData);
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update provider");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update provider";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Delete a provider by providerId
export const deleteProviderApi = async (providerId) => {
	try {
		const res = await API.get("/deleteProvider", { params: { providerId } });
		const { status, msg } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to delete provider");
		}
		return true;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to delete provider";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Get all providers
export const getProvidersApi = async () => {
	try {
		const res = await API.get("/getproviders");
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch providers");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch providers";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Toggle provider status by providerId
export const toggleProviderStatusApi = async (providerId) => {
	try {
		const res = await API.get("/toggleproviderStatus", {
			params: { providerId },
		});
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to toggle provider status");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to toggle provider status";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Get a provider by id
export const getProviderByIdApi = async (id) => {
	try {
		const res = await API.get("/getProviderById", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch provider");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch provider";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};
