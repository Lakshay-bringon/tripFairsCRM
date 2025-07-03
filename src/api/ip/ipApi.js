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

// Add a new IP
export const addIpApi = async ({ ip, allowed_status, description }) => {
	try {
		const res = await API.post("/addIp", { ip, allowed_status, description });
		const { status, msg, data } = res.data;
		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to add IP");
		}
		return data;
	} catch (err) {
		if (err.response?.data?.msg) {
			let errorMsg = err.response.data.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Failed to add IP");
		}
		throw new Error(err.message || "Add IP error");
	}
};

// Update an existing IP
export const updateIpApi = async ({ id, ip, allowed_status, description }) => {
	try {
		const res = await API.post("/updateIp", {
			id,
			ip,
			allowed_status,
			description,
		});
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update IP");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update IP";

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

// Get the list of all IPs
export const getIpListApi = async () => {
	try {
		const res = await API.get("/ipList");
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch IP list");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch IP list";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Toggle IP status by id
export const toggleIpStatusApi = async (id) => {
	try {
		const res = await API.get("/toggleIpStatus", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to toggle IP status");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to toggle IP status";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

// Get IP info
export const getIpInfoApi = async () => {
	try {
		const res = await API.get("/getIpInfo");
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch IP info");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch IP info";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

export const deleteIpApi = async (id) => {
	try {
		const res = await API.get("/deleteIp", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to delete IP");
		}
		return data;
	} catch (err) {
		if (err.response?.data?.msg) {
			let errorMsg = err.response.data.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Failed to delete IP");
		}
		throw new Error(err.message || "Delete IP error");
	}
};

// Toggle IP status for admin by userId
export const toggleIpStatusAdminApi = async (userId, status) => {
	try {
		const res = await API.get("/toggleIpStatusAdmin", {
			params: { userId, status },
		});
		const { status: responseStatus, msg, data } = res.data;
		if (responseStatus !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to toggle IP status");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to toggle IP status";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};
