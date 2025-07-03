import { useAuthContext } from "../AuthProvider";

export const useHasRole = (role) => {
	const { role: userRole } = useAuthContext();
	return userRole === role;
};

export const useHasAnyRole = (roles = []) => {
	const { role: userRole } = useAuthContext();
	return roles.includes(userRole);
};
