import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Modal } from "../../components/common";
import { useAuth } from "../../auth/hooks/useAuth";
import { changePasswordApi } from "../../api";

export default function ChangePasswordModal({ onClose }) {
	const { user, token, logout } = useAuth();
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [form, setForm] = useState({ current: "", new: "", confirm: "" });
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.new.length < 6)
			return setError("New password must be at least 6 characters.");
		if (form.new !== form.confirm) return setError("Passwords do not match.");
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			await changePasswordApi({
				user_id: user?.id,
				current_password: form.current,
				new_password: form.new,
				confirm_password: form.confirm,
				email: user?.email,
				token,
			});
			setSuccess("Password changed successfully.");
			setTimeout(() => {
				setLoading(false);
				onClose();
				setTimeout(() => {
					// Logout user after modal closes
					if (typeof window !== "undefined") {
						window.location.href = "/login";
					}
					if (typeof logout === "function") {
						logout();
					}
				}, 400);
			}, 1200);
		} catch (err) {
			setLoading(false);
			setError(err.message || "Failed to change password");
		}
	};

	const formContent = (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<div className="relative">
					<Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
					<input
						type={showCurrent ? "text" : "password"}
						name="current"
						required
						className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
						placeholder="Current password"
						value={form.current}
						onChange={handleChange}
					/>
					<button
						type="button"
						onClick={() => setShowCurrent((v) => !v)}
						className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
						tabIndex={-1}
					>
						{showCurrent ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>
			<div>
				<div className="relative">
					<Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
					<input
						type={showNew ? "text" : "password"}
						name="new"
						required
						className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
						placeholder="New password"
						value={form.new}
						onChange={handleChange}
					/>
					<button
						type="button"
						onClick={() => setShowNew((v) => !v)}
						className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
						tabIndex={-1}
					>
						{showNew ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>
			<div>
				<div className="relative">
					<Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
					<input
						type={showConfirm ? "text" : "password"}
						name="confirm"
						required
						className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
						placeholder="Confirm new password"
						value={form.confirm}
						onChange={handleChange}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm((v) => !v)}
						className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
						tabIndex={-1}
					>
						{showConfirm ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>
			{error && <div className="text-red-400 text-sm text-center">{error}</div>}
			{success && (
				<div className="text-green-400 text-sm text-center">{success}</div>
			)}
			<div className="flex gap-3 mt-4">
				<button
					type="button"
					className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold text-sm"
					onClick={onClose}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm font-semibold"
				>
					{loading ? "Changing..." : "Change Password"}
				</button>
			</div>
		</form>
	);

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			title="Change Password"
			maxWidth="md"
		>
			{formContent}
		</Modal>
	);
}
