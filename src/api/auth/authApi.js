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

export const loginApi = async (email, password) => {
	try {
		const res = await API.post("/login", { email, password });
		const { status, msg, message } = res.data;
		if (status !== 200) {
			let errorMsg = msg || message;
			if (errorMsg && typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Login failed");
		}

		return msg || message || "Login successful";
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data.msg || err.response.data.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Login failed");
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};

export const changePasswordApi = async ({
	user_id,
	current_password,
	new_password,
	confirm_password,
	email,
	token,
}) => {
	try {
		const res = await API.post(
			"/changePassword",
			{
				user_id,
				current_password,
				new_password,
				confirm_password,
			},
			{
				headers: {
					// "X-Email-ID": email,
					// "X-Access-Key": token,
				},
			}
		);
		const { status, msg } = res.data;
		if (status !== 200) {
			let errorMsg = msg;
			if (msg && typeof msg === "object") {
				errorMsg = flattenErrorMessages(msg).join(" ");
			}
			throw new Error(errorMsg || "Password change failed");
		}
		return msg || "Password changed successfully";
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data.msg || err.response.data.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Password change failed");
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};

export const forgetPasswordApi = async (email) => {
	try {
		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email format");
		}

		const res = await API.post("/forgetPassword", { email });
		const { status, msg, message } = res.data;
		if (status !== 200) {
			let errorMsg = msg || message;
			if (errorMsg && typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Password reset request failed");
		}

		return msg || message || "Password reset link sent to your email";
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data.msg || err.response.data.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "Password reset request failed");
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};

export const verifyOTPApi = async (email, otp) => {
	try {
		// OTP format validation
		const otpRegex = /^\d{6}$/; // Assuming OTP is a 6-digit number
		if (!otpRegex.test(otp)) {
			throw new Error("Invalid OTP format");
		}
		const res = await API.post("/verifyOtp", { email, otp });
		const { status, msg, message, data } = res.data;
		if (status !== 200) {
			let errorMsg = msg || message;
			if (errorMsg && typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "OTP verification failed");
		}

		// After successful OTP verification, extract user and token from response
		if (data) {
			const {
				api_token: token,
				name,
				alies_name: alias,
				created_at,
				email: userEmail,
				id,
				leader_id,
				role_id,
				status: userStatus,
			} = data;

			const user = {
				name,
				alias,
				created_at,
				email: userEmail,
				id,
				leader_id,
				role_id,
				status: userStatus,
			};

			return { user, token };
		}

		return msg || message || "OTP verified successfully";
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data.msg || err.response.data.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "OTP verification failed");
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};

export const resendOTPApi = async (email) => {
	try {
		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email format");
		}

		const res = await API.post("/resendOtp", { email });
		const { status, msg, message } = res.data;
		if (status !== 200) {
			let errorMsg = msg || message;
			if (errorMsg && typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "OTP resend failed");
		}

		return msg || message || "OTP resent successfully";
	} catch (err) {
		if (err.response) {
			let errorMsg = err.response.data.msg || err.response.data.message;
			if (typeof errorMsg === "object") {
				errorMsg = flattenErrorMessages(errorMsg).join(" ");
			}
			throw new Error(errorMsg || "OTP resend failed");
		} else if (err.request) {
			throw new Error("No response from server");
		} else {
			throw new Error(err.message);
		}
	}
};
