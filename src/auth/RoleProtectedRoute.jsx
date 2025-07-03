import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Usage: <RoleProtectedRoute allowedRoles={[1]}><Component /></RoleProtectedRoute>
export default function RoleProtectedRoute({ allowedRoles, children }) {
	const { user } = useAuth();
	const location = useLocation();
	if (!user || !allowedRoles.includes(user.role_id)) {
		return <Navigate to="/access-denied" replace state={{ from: location }} />;
	}
	return children;
}
