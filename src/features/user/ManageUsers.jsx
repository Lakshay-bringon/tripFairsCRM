import { useState, useEffect } from "react";
import { RecordsList } from "../data";
import UserCard from "./UserCard";
import UserDetailsForm from "./UserDetailsForm";
import {
	getUserListApi,
	addUserApi,
	updateUserApi,
	toggleUserStatusApi,
	getUserByIdApi,
	deleteUserApi,
	getTeamApi,
} from "../../api";
import { useAuthContext } from "../../auth/AuthProvider";

import { showPromiseToast } from "../../utils/showPromiseToast";

export default function UserMGMT() {
	const { user, role, role_id } = useAuthContext();

	const [search, setSearch] = useState("");
	const [searchBy, setSearchBy] = useState("name");
	const [userPage, setUserPage] = useState(1);
	const [userPerPage, setUserPerPage] = useState(5);
	const [showUserForm, setShowUserForm] = useState(false);
	const [users, setUsers] = useState([]);
	const [editUser, setEditUser] = useState(null);

	// Fetch users from API
	const fetchUsers = async () => {
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
			throw err;
		}
	};

	useEffect(() => {
		showPromiseToast(fetchUsers(), {
			loading: "Loading users...",
			success: "Users loaded successfully",
			error: (err) => err.message || "Failed to load users",
		});
	}, []);

	const handleAddUser = async (userData) => {
		const result = await addUserApi(userData);
		await fetchUsers();
		return result;
	};

	const handleUpdateUser = async (userData) => {
		const result = await updateUserApi(userData);
		await fetchUsers();
		return result;
	};

	const handleStatusChange = async (id) => {
		try {
			await toggleUserStatusApi(id);
			fetchUsers();
		} catch (err) {
			alert(err.message);
		}
	};

	const handleEdit = (user) => {
		setEditUser(user);
		setShowUserForm(true);
	};

	const handleDelete = async (id) => {
		try {
			await showPromiseToast(deleteUserApi(id), {
				loading: "Deleting user...",
				success: "User deleted successfully",
				error: (err) => err.message || "Failed to delete user",
			});
			await fetchUsers();
		} catch (err) {}
	};

	const filteredUsers = users.filter((u) => {
		const value = String(u[searchBy] || "").toLowerCase();
		return value.includes(search.toLowerCase());
	});

	const recordsToShow = search.trim() === "" ? users : filteredUsers;

	const handleSearch = (e) => {
		e.preventDefault();
		// No-op, search is reactive
	};

	return (
		<div className="w-full h-full">
			{/* Search Form + Add User Button */}
			<div className="mb-4 flex items-center w-full gap-2">
				<form className="flex flex-1 gap-2 max-w-xl" onSubmit={handleSearch}>
					{" "}
					<select
						value={searchBy}
						onChange={(e) => setSearchBy(e.target.value)}
						className="w-36 px-2 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
					>
						{/* Temporarily commented out ID option */}
						{/* <option value="id">ID</option> */}
						<option value="name">Name</option>
						<option value="email">Email</option>
					</select>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
						placeholder={`Search user by ${searchBy}...`}
					/>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold whitespace-nowrap"
					>
						Search
					</button>
				</form>
				<button
					className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold whitespace-nowrap"
					onClick={() => {
						setEditUser(null);
						setShowUserForm(true);
					}}
				>
					+ Add User
				</button>
			</div>
			{/* {error && <div className="text-red-500 mb-2">{error}</div>} */}
			{/* Users List */}
			<RecordsList
				title="Users List"
				list={recordsToShow}
				CardComponent={({ record }) => (
					<UserCard
						user={record}
						onEdit={() => {
							handleEdit(record);
						}}
						onRemove={() => {
							handleDelete(record.id);
						}} // Implement if needed
						onStatusChange={() => {
							showPromiseToast(handleStatusChange(record.id), {
								loading: "Updating status...",
								success: "User status updated",
								error: (err) => err.message || "Failed to update status",
							});
						}}
					/>
				)}
				currentPage={userPage}
				onPageChange={setUserPage}
				itemsPerPage={userPerPage}
				onItemsPerPageChange={setUserPerPage}
				showPagination={true}
				className="w-full"
			/>
			{showUserForm && (
				<UserDetailsForm
					onClose={() => {
						setShowUserForm(false);
						setEditUser(null);
					}}
					onSubmit={editUser ? handleUpdateUser : handleAddUser}
					user={editUser}
				/>
			)}
		</div>
	);
}
