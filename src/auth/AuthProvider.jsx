import { createContext, useContext, useState } from "react";
import {
	loginApi,
	forgetPasswordApi,
	verifyOTPApi,
	resendOTPApi,
} from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(() => sessionStorage.getItem("jwt_token"));
	const [user, setUser] = useState(() => {
		const stored = sessionStorage.getItem("user");
		return stored && stored !== "undefined" ? JSON.parse(stored) : null;
	});
	const login = async (email, password) => {
		return await loginApi(email, password);
	};
	const resendOtp = async (email) => {
		return await resendOTPApi(email);
	};

	const verifyOtp = async (email, otp) => {
		const { user, token } = await verifyOTPApi(email, otp);
		sessionStorage.setItem("jwt_token", token);
		sessionStorage.setItem("user", JSON.stringify(user));
		setToken(token);
		setUser(user);
	};

	const forgetPassword = async (email) => {
		return await forgetPasswordApi(email);
	};

	const logout = () => {
		sessionStorage.removeItem("jwt_token");
		sessionStorage.removeItem("user");
		setToken(null);
		setUser(null);
	};

	// Map role_id to role string
	const ROLE_MAP = {
		1: "admin",
		2: "leader",
		3: "agent",
	};

	const parsedRoleId = user?.role_id ? Number(user.role_id) : undefined;
	const role = parsedRoleId ? ROLE_MAP[parsedRoleId] : undefined;
	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				forgetPassword,
				verifyOtp,
				resendOtp,
				isAuthenticated: !!user,
				role,
				role_id: parsedRoleId,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
