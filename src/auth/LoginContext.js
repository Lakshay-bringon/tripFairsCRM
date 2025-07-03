import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from '../AuthProvider';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
	const { user, login, logout } = useAuthContext();
	const [loginLoading, setLoginLoading] = useState(false);
	const [loginError, setLoginError] = useState(null);
	const [rememberMe, setRememberMe] = useState(false);

	// Check for remembered credentials on mount
	useEffect(() => {
		const rememberedEmail = sessionStorage.getItem('rememberedEmail');
		if (rememberedEmail) {
			setRememberMe(true);
		}
	}, []);

	const handleLogin = async (credentials) => {
		setLoginLoading(true);
		setLoginError(null);

		try {
			const result = await login(credentials);

			// Handle remember me functionality
			if (rememberMe && credentials.email) {
				sessionStorage.setItem('rememberedEmail', credentials.email);
			} else {
				sessionStorage.removeItem('rememberedEmail');
			}

			return result;
		} catch (error) {
			setLoginError(error.message || 'Login failed');
			throw error;
		} finally {
			setLoginLoading(false);
		}
	};

	const handleLogout = async () => {
		setLoginLoading(true);
		try {
			await logout();
			// Clear remember me if needed
			if (!rememberMe) {
				sessionStorage.removeItem('rememberedEmail');
			}
		} catch (error) {
			setLoginError(error.message || 'Logout failed');
			throw error;
		} finally {
			setLoginLoading(false);
		}
	};

	const clearLoginError = () => {
		setLoginError(null);
	};

	const getRememberedEmail = () => {
		return sessionStorage.getItem('rememberedEmail');
	};

	const value = {
		// Auth state
		user,
		isAuthenticated: !!user,

		// Login state
		loginLoading,
		loginError,
		rememberMe,

		// Actions
		handleLogin,
		handleLogout,
		clearLoginError,
		setRememberMe,
		getRememberedEmail,

		// Utility functions
		isAdmin: () => user?.role_id === 1 || user?.role === 'admin',
		isLeader: () => user?.role_id === 2 || user?.role === 'leader',
		isAgent: () => user?.role_id === 3 || user?.role === 'agent',

		hasRole: (role) => {
			if (typeof role === 'string') {
				return user?.role === role;
			}
			return user?.role_id === role;
		},

		hasAnyRole: (roles) => {
			return roles.some((role) => {
				if (typeof role === 'string') {
					return user?.role === role;
				}
				return user?.role_id === role;
			});
		},

		canAccess: (feature) => {
			// Define feature permissions based on roles
			const permissions = {
				userManagement: [1], // Only admin
				teamManagement: [1, 2], // Admin and leader
				bookingManagement: [1, 2, 3], // All roles
				revenueManagement: [1, 2], // Admin and leader
				ipManagement: [1], // Only admin
				systemSettings: [1], // Only admin
			};

			const allowedRoles = permissions[feature] || [];
			return allowedRoles.includes(user?.role_id);
		},
	};

	return (
		<LoginContext.Provider value={value}>{children}</LoginContext.Provider>
	);
};

export const useLoginContext = () => {
	const context = useContext(LoginContext);
	if (!context) {
		throw new Error('useLoginContext must be used within a LoginProvider');
	}
	return context;
};

// Convenience hook for login functionality
export const useLogin = () => {
	const {
		handleLogin,
		handleLogout,
		loginLoading,
		loginError,
		clearLoginError,
		rememberMe,
		setRememberMe,
		getRememberedEmail,
	} = useLoginContext();

	return {
		login: handleLogin,
		logout: handleLogout,
		loading: loginLoading,
		error: loginError,
		clearError: clearLoginError,
		rememberMe,
		setRememberMe,
		getRememberedEmail,
	};
};
