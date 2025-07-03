import axios from 'axios';

const API = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add token if available
API.interceptors.request.use((config) => {
	const token = sessionStorage.getItem('jwt_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default API;
