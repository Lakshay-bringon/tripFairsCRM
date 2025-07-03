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

/**
 * Fetch dashboard summary data
 * @param {Object} payload - { dateFilter, startDate, endDate }
 * @returns {Promise<Object>} Dashboard summary data
 */
export const dashboardSummaryApi = async (payload) => {
	try {
		if (!payload?.dateFilter) throw new Error("dateFilter is required");
		if (
			payload.dateFilter === "custom" &&
			(!payload.startDate || !payload.endDate)
		) {
			throw new Error(
				"startDate and endDate are required for custom dateFilter"
			);
		}
		const res = await API.post("/dashboardSummary", payload);
		if (res.data?.status !== 200) {
			let errorMsg = res.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch dashboard summary");
		}
		return res.data.data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch dashboard summary";
			throw new Error(errorMsg);
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};

/**
 * Fetch top/bottom agent report
 * @param {Object} payload - { dateFilter, startDate, endDate }
 * @returns {Promise<Object>} Top/Bottom agent report data
 */
export const topBottomAgentReportApi = async (payload) => {
	try {
		if (!payload?.dateFilter) throw new Error("dateFilter is required");
		if (
			payload.dateFilter === "custom" &&
			(!payload.startDate || !payload.endDate)
		) {
			throw new Error(
				"startDate and endDate are required for custom dateFilter"
			);
		}
		const res = await API.post("/topBottomAgentReport", payload);

		if (res.data?.status !== "success") {
			let errorMsg = res.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch top/bottom agent report");
		}
		const performers = {
			top_agents: res.data.top_agents,
			bottom_agents: res.data.bottom_agents,
		};
		return performers;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch top/bottom agent report";
			throw new Error(errorMsg);
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};

/**
 * Fetch dashboard overview data
 * @param {Object} params - { userId, date_from, date_to }
 * @returns {Promise<Object>} Dashboard overview data
 */
export const dashboardOverviewApi = async (params) => {
	try {
		// Validate required parameters
		if (!params?.userId) throw new Error("userId is required");
		if (!params?.date_from) throw new Error("date_from is required");
		if (!params?.date_to) throw new Error("date_to is required");

		// Prepare query parameters
		const queryParams = {
			userId: params.userId,
			date_from: params.date_from,
			date_to: params.date_to,
		};

		const res = await API.get("/dashboardOverview", { params: queryParams });

		if (res.data?.status !== 200) {
			let errorMsg = res.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch dashboard overview");
		}

		return res.data.data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.message || err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch dashboard overview";
			throw new Error(errorMsg);
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};
