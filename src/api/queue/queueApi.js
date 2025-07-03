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

// Get active queue
export const activeQueuesApi = async () => {
	try {
		const res = await API.get("/activeQueues");
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch active queue");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch active queue";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Add a new queue
export const addQueueApi = async (queue, number) => {
	try {
		const res = await API.post("/addQueue", { queue, number });
		const { status, msg, data } = res.data;
		if (status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to add queue");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to add queue";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Update an existing queue
export const updateQueueApi = async ({ id, queue, number }) => {
	try {
		const res = await API.post("/updateQueue", { id, queue, number });
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update queue");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update queue";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Delete a queue by id
export const deleteQueueApi = async (id) => {
	try {
		const res = await API.get("/deleteQueue", { params: { id } });
		const { status, msg } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to delete queue");
		}
		return true;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to delete queue";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Get a queue by id
export const getQueueApi = async (id) => {
	try {
		const res = await API.get(`/getQueue/${id}`);
		const { status, msg, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch queue");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch queue";
			throw new Error(errorMsg);
		}
		throw new Error(err.message);
	}
};

// Toggle queue status by id
export const toggleQueueStatusApi = async (id) => {
	try {
		const res = await API.get("/toggleQueueStatus", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to toggle queue status");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to toggle queue status");
		throw new Error(err.message);
	}
};

// Get the list of all currencies
export const getQueueListApi = async () => {
	try {
		const res = await API.get("/getQueues");
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to fetch queue list");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to fetch queue list");
		throw new Error(err.message);
	}
};
