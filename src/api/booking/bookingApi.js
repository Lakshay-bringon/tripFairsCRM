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

export const updateBookingApi = async (updateData) => {
	try {
		const res = await API.post("/updateBooking", updateData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		const { status, msg, data } = res.data;
		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update booking");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update booking";

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

export const createReservationApi = async (reservationData) => {
	try {
		const res = await API.post("/createReservation", reservationData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		const { status, msg, data } = res.data;
		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to create reservation");
		}
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			const errorMsg = err.response.data?.msg || "Failed to create reservation";
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

export const updateBookingProviderDetails = async (providerData) => {
	try {
		const res = await API.post("/updateBookingProviderDetails", providerData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update provider details");
		}

		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update provider details";

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

export const updateRefundDetails = async (refundData) => {
	try {
		const res = await API.post("/updateRefundDetails", refundData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update refund details");
		}

		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update refund details";

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

export const updateChargebackDetails = async (chargebackData) => {
	try {
		const res = await API.post("/updateChargebackDetails", chargebackData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update chargeback details");
		}

		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update chargeback details";

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

export const updateBookingChargingDetails = async (chargingData) => {
	try {
		const res = await API.post("/updateBookingChargingDetails", chargingData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to update charging details");
		}

		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update charging details";
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

export const findBookingApi = async (searchData) => {
	try {
		const res = await API.post("/findBooking", searchData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		// Handle different response structures
		if (res.data) {
			const { status, msg, data } = res.data;
			if (status !== 200 && status !== 201) {
				let errorMsg = msg;
				if (msg && typeof msg === "object") {
					errorMsg = flattenErrorMessages(msg).join(" ");
				}
				throw new Error(errorMsg || "Failed to find bookings");
			} // Return the raw data array
			const resultData = Array.isArray(data) ? data : [];
			return resultData;
		}

		// Fallback if response structure is different
		const fallbackData = Array.isArray(res.data) ? res.data : [];
		return fallbackData;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg || err.response.data?.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to find bookings";
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

export const getBookingByBid = async (bid) => {
	try {
		const res = await API.get(`/getBookingByBid`, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			params: {
				bid: bid,
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch booking details");
		}

		// Return the mapped booking data
		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg || err.response.data?.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch booking details";
			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

export const dispatchEmailApi = async (emailData) => {
	try {
		const res = await API.post("/dispatchEmail", emailData, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to dispatch email");
		}

		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to dispatch email";

			const errorDetails = err.response.data?.errors;
			if (errorDetails && typeof errorDetails === "object") {
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

		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

export const addCommentApi = async (payload) => {
	try {
		const res = await API.post("/addComment", payload, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to add comment");
		}

		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to add comment";

			const errorDetails = err.response.data?.errors;
			if (errorDetails && typeof errorDetails === "object") {
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

		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		throw new Error(err.message);
	}
};

export const getCommentsByBidApi = async (bid) => {
	try {
		const res = await API.get(`/getCommentsByBid`, {
			params: { bid },
			headers: {
				Accept: "application/json",
			},
		});
		const { status, msg, data } = res.data;
		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch comments");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch comments";
			throw new Error(errorMsg);
		}
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}
		throw new Error(err.message);
	}
};

export const getActivityByBidApi = async (bid) => {
	try {
		const res = await API.get(`/getActivityByBid`, {
			params: { bid },
			headers: {
				Accept: "application/json",
			},
		});
		const { status, msg, data } = res.data;
		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch activity");
		}
		return data;
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch activity";
			throw new Error(errorMsg);
		}
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}
		throw new Error(err.message);
	}
};

export const getRecentBookingsApi = async (userId) => {
	try {
		const res = await API.get("/recentBooking", {
			headers: {
				Accept: "application/json",
			},
			params: {
				userId: userId,
			},
		});

		const { status, msg, data } = res.data;
		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to fetch recent bookings");
		}
		// Return the raw data if data exists
		if (Array.isArray(data)) {
			return data;
		}

		return data || [];
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to fetch recent bookings";
			throw new Error(errorMsg);
		}
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}
		throw new Error(err.message);
	}
};

export const dispatchEticketApi = async (eticketData) => {
	try {
		// Determine if we're sending FormData or JSON

		const res = await API.post("/dispatchEticket", eticketData);
		const { status, msg, data } = res.data;
		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to dispatch e-ticket");
		}
		return data;
	} catch (err) {
		// // Handle API errors
		// console.log('Error dispatching e-ticket:', err);
		// console.log('Error response:', err.response);
		// console.log('Error response data:', err.response?.data);

		if (err.response) {
			// Get status code and status text
			const status = err.response.status;
			const statusText = err.response.statusText;

			// Try to extract error message from response data
			let errorMsg =
				err.response.data?.msg ||
				err.response.data?.message ||
				err.response.data?.error;

			// If errorMsg is an object, flatten it
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}

			// If no specific error message, use status-based message
			if (!errorMsg) {
				switch (status) {
					case 400:
						errorMsg = "Bad request - Invalid data provided";
						break;
					case 401:
						errorMsg = "Unauthorized - Please check your credentials";
						break;
					case 403:
						errorMsg =
							"Forbidden - You don't have permission to perform this action";
						break;
					case 404:
						errorMsg = "Not found - The requested resource was not found";
						break;
					case 500:
						errorMsg =
							"Internal server error - Please try again later or contact support";
						break;
					default:
						errorMsg = `Server error (${status}): ${statusText}`;
				}
			}

			// Handle validation errors
			const errorDetails = err.response.data?.errors;
			if (errorDetails && typeof errorDetails === "object") {
				const validationErrors = Object.entries(errorDetails)
					.map(
						([field, messages]) =>
							`${field}: ${
								Array.isArray(messages) ? messages.join(", ") : messages
							}`
					)
					.join("; ");
				throw new Error(`${errorMsg}. Validation errors: ${validationErrors}`);
			}

			throw new Error(errorMsg);
		}

		// Handle network errors
		if (err.request) {
			throw new Error("Network error: Unable to connect to server");
		}

		// Handle other errors
		throw new Error(err.message || "An unexpected error occurred");
	}
};

export const createReservationApiFormData = async (reservationData) => {
	try {
		const formData = new FormData();

		// Loop through all keys in reservationData
		for (const key in reservationData) {
			if (key === "itinerary" && Array.isArray(reservationData[key])) {
				// Append each file in the itinerary array
				reservationData[key].forEach((file, index) => {
					formData.append("itinerary[]", file);
				});
				// Remove image_itinerary from reservationData to avoid sending twice
				delete reservationData.bookingData.image_itinerary;
				continue;
			} else if (key === "bookingData") {
				// Defer appending bookingData until after image_itinerary is removed
				formData.append(
					"bookingData",
					JSON.stringify(reservationData.bookingData)
				);
				continue;
			} else {
				formData.append(key, reservationData[key]);
			}
		}

		const res = await API.post("/createReservationFormData", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to create reservation");
		}

		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			const errorMsg = err.response.data?.msg || "Failed to create reservation";
			const errorDetails = err.response.data?.errors;

			if (errorDetails && typeof errorDetails === "object") {
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

export const updateBookingApiFormData = async (reservationData) => {
	try {
		const formData = new FormData();

		// Loop through all keys in reservationData
		for (const key in reservationData) {
			if (key === "itinerary" && Array.isArray(reservationData[key])) {
				// Append each file in the itinerary array
				reservationData[key].forEach((file, index) => {
					formData.append("itinerary[]", file);
				});
				// Remove image_itinerary from reservationData to avoid sending twice
				delete reservationData.bookingData.image_itinerary;
				continue;
			} else if (key === "bookingData") {
				// Defer appending bookingData until after image_itinerary is removed
				formData.append(
					"bookingData",
					JSON.stringify(reservationData.bookingData)
				);
				continue;
			} else {
				formData.append(key, reservationData[key]);
			}
		}

		const res = await API.post("/updateBookingFormData", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const { status, msg, data } = res.data;

		if (status !== 200 && status !== 201) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Failed to create reservation");
		}

		return data;
	} catch (err) {
		// Handle API errors
		if (err.response) {
			let errorMsg = err.response.data?.msg;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			errorMsg = errorMsg || "Failed to update booking";

			const errorDetails = err.response.data?.errors;

			if (errorDetails && typeof errorDetails === "object") {
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
