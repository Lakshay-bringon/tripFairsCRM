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

export const getRevenueDashboardApi = async (userId) => {
	try {
		if (!userId) throw new Error("userId is required");
		const res = await API.get(`revenueDashbord`, { params: { userId } });
		if (res.data?.status !== 200) {
			let errorMsg = res.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch revenue dashboard");
		}
		return res.data.data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg || err.response.data?.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch revenue dashboard";

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

// export const getDetailedRevenueApi = async (payload) => {
// 	try {
// 		if (!payload?.userId) throw new Error("userId is required in payload");
// 		if (
// 			payload.dateFilter === "custom" &&
// 			(!payload.startDate || !payload.endDate)
// 		) {
// 			throw new Error(
// 				"startDate and endDate are required for custom dateFilter"
// 			);
// 		}
// 		const res = await API.post(`/detailedRevenue`, payload);
// 		if (res.data?.status !== 200) {
// 			let errorMsg = res.data?.msg;
// 			if (typeof errorMsg === "object") {
// 				errorMsg = flattenErrorMessages(errorMsg).join(" ");
// 			}
// 			throw new Error(errorMsg || "Failed to fetch detailed revenue");
// 		}
// 		return res.data.data;
// 	} catch (err) {
// 		// Handle API errors
// 		if (err.response) {
// 			let errorMsg = err.response.data?.msg || err.response.data?.message;
// 			if (typeof errorMsg === "object") {
// 				errorMsg = flattenErrorMessages(errorMsg).join(" ");
// 			}
// 			errorMsg = errorMsg || "Failed to fetch detailed revenue";

// 			const errorDetails = err.response.data?.errors;
// 			if (errorDetails && typeof errorDetails === "object") {
// 				// Handle validation errors from server
// 				const validationErrors = Object.entries(errorDetails)
// 					.map(
// 						([field, messages]) =>
// 							`${field}: ${
// 								Array.isArray(messages) ? messages.join(", ") : messages
// 							}`
// 					)
// 					.join("; ");
// 				throw new Error(validationErrors);
// 			}
// 			throw new Error(errorMsg);
// 		}

// 		// Handle network errors
// 		if (err.request) {
// 			throw new Error("Network error: Unable to connect to server");
// 		}

// 		throw new Error(err.message);
// 	}
// };

export const getRevenueListApi = async (params) => {
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
			show_refund: params.show_refund ?? false,
			show_chargeback: params.show_chargeback ?? false,
			// Add pagination and sorting parameters
			page: params.page || 1,
			limit: params.limit || 10,
			// Add optional filters
			agent_id: params.agent_id,
			provider_id: params.provider_id,
		};

		const res = await API.get("/revenueList", { params: queryParams });

		if (res.data?.status !== 200) {
			let errorMsg = res.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch revenue list");
		}

		return res.data.data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg || err.response.data?.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch revenue list";

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

export const downloadReportApi = async (params) => {
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
			show_refund: params.show_refund ?? false,
			show_chargeback: params.show_chargeback ?? false,
			agent_id: params.agent_id,
			provider_id: params.provider_id,
		};

		// Configure for blob response (file download)
		const res = await API.get("/downloadReport", {
			params: queryParams,
			responseType: "blob", // Important: Handle binary data
		});

		// For blob responses, we get the blob directly
		// Extract filename from Content-Disposition header if available
		const contentDisposition = res.headers["content-disposition"];
		let filename = "revenue_report.csv";

		if (contentDisposition) {
			const fileNameMatch = contentDisposition.match(
				/filename[^;=\n]*=([^;]*)/
			);
			if (fileNameMatch && fileNameMatch[1]) {
				filename = fileNameMatch[1].replace(/['"]/g, "");
			}
		}

		// Create download link
		const blob = new Blob([res.data], {
			type: res.headers["content-type"] || "text/csv",
		});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);

		return { success: true, filename };
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg || err.response.data?.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to download Revenue Report";

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
