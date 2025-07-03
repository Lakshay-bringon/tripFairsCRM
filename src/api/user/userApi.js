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

// Add a new user
export const addUserApi = (formData) => {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await API.post("/addUser", formData);
			const { status, msg, data } = res.data;
			if (status !== 200 && status !== 201) {
				let errorMsg = msg;
				if (msg && typeof msg === "object") {
					errorMsg = flattenErrorMessages(msg).join(" ");
				}
				return reject(errorMsg || "Failed to add user inside if block");
			}
			return resolve(data);
		} catch (err) {
			if (err.response?.data?.msg) {
				let errorMsg = err.response.data.msg;
				if (typeof errorMsg === "object") {
					errorMsg = flattenErrorMessages(errorMsg).join(" ");
				}
				return reject(errorMsg || "Failed to add user inside catch block");
			}
			return reject(err.message || "Add user error");
		}
	});
};

// Update an existing user
export const updateUserApi = async (formData) => {
	try {
		const res = await API.post("/updateUser", formData);
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to update user");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to update user");
		throw new Error(err.message);
	}
};

// Toggle user status by id
export const toggleUserStatusApi = async (id) => {
	try {
		const res = await API.get("/toggleUserStatus", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to toggle user status");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to toggle user status");
		throw new Error(err.message);
	}
};

// Get the list of all users
export const getUserListApi = async () => {
	try {
		const res = await API.get("/getUserList");
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to fetch user list");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to fetch user list");
		throw new Error(err.message);
	}
};

// Get a user by id
export const getUserByIdApi = async (id) => {
	try {
		const res = await API.get("/getUserById", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to fetch user");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to fetch user");
		throw new Error(err.message);
	}
};

// Get users by roleId
export const getUserByRoleApi = async (roleId) => {
	try {
		const res = await API.get("/getuserByRole", { params: { roleId } });
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to fetch users by role");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to fetch users by role");
		throw new Error(err.message);
	}
};

// Get team members by leader_id
export const getTeamApi = async (leader_id) => {
	try {
		const res = await API.get("/getTeam", { params: { leader_id } });
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to fetch team members");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to fetch team members");
		throw new Error(err.message);
	}
};

// Delete a user by id
export const deleteUserApi = async (id) => {
	try {
		const res = await API.get("/deleteUser", { params: { id } });
		const { status, msg, data } = res.data;
		if (status !== 200) throw new Error(msg || "Failed to delete user");
		return data;
	} catch (err) {
		if (err.response)
			throw new Error(err.response.data.msg || "Failed to delete user");
		throw new Error(err.message);
	}
};
