import { useState, useEffect } from "react";
import {
	getUserListApi,
	addUserApi,
	updateUserApi,
	toggleUserStatusApi,
	getTeamApi,
} from "../../api";
import { useAuthContext } from "../../auth/AuthProvider";
import { showPromiseToast } from "../../utils/showPromiseToast";

export const useUser = () => {
	const { user, role, role_id } = useAuthContext();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch users from API
	const fetchUsers = async () => {
		setLoading(true);
		setError(null);
		try {
			let data;
			if (role === "leader" || role_id === 2) {
				data = await getTeamApi(user?.id);
			} else {
				data = await getUserListApi();
			}
			setUsers(data || []);
			return data;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// Add a new user
	const addUser = async (userData) => {
		try {
			const result = await addUserApi(userData);
			await fetchUsers(); // Refresh the list
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	// Update a user
	const updateUser = async (userData) => {
		try {
			const result = await updateUserApi(userData);
			await fetchUsers(); // Refresh the list
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	// Toggle user status
	const toggleUserStatus = async (userId) => {
		try {
			await toggleUserStatusApi(userId);
			await fetchUsers(); // Refresh the list
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	// Load users on mount
	useEffect(() => {
		showPromiseToast(fetchUsers(), {
			loading: "Loading users...",
			success: "Users loaded successfully",
			error: (err) => err.message || "Failed to load users",
		});
	}, []);

	return {
		users,
		loading,
		error,
		fetchUsers,
		addUser,
		updateUser,
		toggleUserStatus,
		refetch: fetchUsers,
	};
};

export const useUserSearch = (users, searchQuery, searchBy = "name") => {
	const [filteredUsers, setFilteredUsers] = useState([]);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredUsers(users);
		} else {
			const filtered = users.filter((user) => {
				const value = String(user[searchBy] || "").toLowerCase();
				return value.includes(searchQuery.toLowerCase());
			});
			setFilteredUsers(filtered);
		}
	}, [users, searchQuery, searchBy]);

	return filteredUsers;
};

export const useUserPagination = (users, itemsPerPage = 10) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

	const totalPages = Math.ceil(users.length / itemsPerPageState);
	const startIndex = (currentPage - 1) * itemsPerPageState;
	const endIndex = startIndex + itemsPerPageState;
	const paginatedUsers = users.slice(startIndex, endIndex);

	const goToPage = (page) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	const nextPage = () => goToPage(currentPage + 1);
	const prevPage = () => goToPage(currentPage - 1);

	// Reset to first page when users change
	useEffect(() => {
		setCurrentPage(1);
	}, [users.length]);

	return {
		currentPage,
		totalPages,
		paginatedUsers,
		itemsPerPage: itemsPerPageState,
		setItemsPerPage: setItemsPerPageState,
		goToPage,
		nextPage,
		prevPage,
		hasNextPage: currentPage < totalPages,
		hasPrevPage: currentPage > 1,
	};
};
