import React, { useRef, useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../components/common";
import { Eye, EyeOff } from "lucide-react";

import {
	Form,
	FormField,
	FormInput,
	FormSelect,
} from "../../components/common";
import { showPromiseToast } from "../../utils/showPromiseToast";
import { useDataContext } from "../../context/DataContext";
import { useAuthContext } from "../../auth/AuthProvider";

const roleOptions = [
	{ label: "Admin", value: "1" },
	{ label: "Leader", value: "2" },
	{ label: "Agent", value: "3" },
];

const getUserSchema = (isEditMode) =>
	z
		.object({
			name: z.string().min(2, "Name is required"),
			alias: z.string().min(2, "Alias is required"),
			photo: z.any().optional(),
			email: z.string().email("Invalid email"),
			confirmEmail: z.string().optional(),
			password: isEditMode
				? z.string().optional()
				: z.string().min(6, "Password is required"),
			confirmPassword: z.string().optional(),
			role: z.string().min(1, "Role is required"),
			leader_id: z.string().optional(),
		})
		.superRefine((data, ctx) => {
			if (data.confirmEmail && data.email !== data.confirmEmail) {
				ctx.addIssue({
					path: ["confirmEmail"],
					code: z.ZodIssueCode.custom,
					message: "Emails do not match",
				});
			}

			if (data.confirmPassword && data.password !== data.confirmPassword) {
				ctx.addIssue({
					path: ["confirmPassword"],
					code: z.ZodIssueCode.custom,
					message: "Passwords do not match",
				});
			}

			if (data.role === "3" && !data.leader_id) {
				ctx.addIssue({
					path: ["leader_id"],
					code: z.ZodIssueCode.custom,
					message: "Team is required for Agents",
				});
			}
		});

export default function UserDetailsForm({
	user = null,
	onSubmit: onSubmitFromProp,
	onClose,
}) {
	const { role, user: loggedInUser } = useAuthContext();
	const { leaders, leadersLoading, fetchLeaders } = useDataContext();
	const [photoPreview, setPhotoPreview] = useState(null);
	const [dragActive, setDragActive] = useState(false);
	const [showConfirmEmail, setShowConfirmEmail] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [selectedRole, setSelectedRole] = useState(
		user ? String(user.role_id) : ""
	);
	const inputFileRef = useRef(null);

	useEffect(() => {
		if (user && user.img) {
			setPhotoPreview(`${import.meta.env.VITE_UPLOADS_BASE_URL}${user.img}`);
		} else {
			setPhotoPreview(null);
		}
	}, [user]);

	const initialData = user
		? {
				name: user.name || "",
				alias: user.alies_name || "",
				email: user.email || "",
				confirmEmail: user.email || "",
				password: "",
				confirmPassword: "",
				photo: undefined,
				role: user.role_id ? String(user.role_id) : "",
				leader_id: user.leader_id ? String(user.leader_id) : "",
		  }
		: {
				name: "",
				alias: "",
				email: "",
				confirmEmail: "",
				password: "",
				confirmPassword: "",
				photo: undefined,
				role: "",
				leader_id: "",
		  };

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm({
		resolver: zodResolver(getUserSchema(!!user)),
		defaultValues: initialData,
		mode: "onBlur",
	});

	const watchRole = watch("role", selectedRole);

	const onPhotoChange = (file) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setPhotoPreview(e.target.result);
			reader.readAsDataURL(file);
			setValue("photo", file);
		}
	};

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file) onPhotoChange(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragActive(false);
		const file = e.dataTransfer.files[0];
		if (file) onPhotoChange(file);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragActive(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setDragActive(false);
	};

	const openFileDialog = () => {
		inputFileRef.current?.click();
	};

	const onSubmit = async (data) => {
		const submitData = {
			...(user && { id: user.id }),
			...data,
			role: data.role,
			// ...(data.role == "3" && { leader_id: data.leader_id }),
			img: photoPreview?.startsWith("data:") ? photoPreview : undefined,
		};

		const result = await showPromiseToast(() => onSubmitFromProp(submitData), {
			loading: user ? "Updating user..." : "Adding user...",
			success: user ? "User updated!" : "User added successfully!",
		});

		// Only close the form if the request was successful
		if (result !== undefined) {
			onClose?.();
		}
	};

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === "email" && value.email !== user?.email) {
				setShowConfirmEmail(true);
			}
			if (name === "password" && value.password) {
				setShowConfirmPassword(true);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, user]);

	useEffect(() => {
		if (user) {
			setSelectedRole(String(user.role_id));
			setValue("role", String(user.role_id));
			setValue("leader_id", user.leader_id ? String(user.leader_id) : "");
		}
	}, [user, setValue]);

	// Determine if leader restrictions apply
	const isLeader = role === "leader";

	// If leader, always set role to "3" (Agent) and leader_id to loggedInUser.id
	useEffect(() => {
		if (!user && isLeader) {
			setValue("role", "3");
			setSelectedRole("3");
			setValue("leader_id", String(loggedInUser.id));
		}
	}, [isLeader, loggedInUser, setValue, user]);

	// Fetch leaders when the selector is shown and not already loading/fetched
	useEffect(() => {
		fetchLeaders();
		// Only run on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			title={user ? "Edit User Details" : "Add User Details"}
			maxWidth="md"
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col h-[80vh]"
			>
				<div className="flex-1 overflow-y-auto pr-2 space-y-2">
					{/* Top section with left fields and photo upload */}
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 space-y-2">
							<FormField error={errors.name?.message}>
								<FormInput {...register("name")} placeholder="Name" />
							</FormField>

							<FormField error={errors.alias?.message}>
								<FormInput {...register("alias")} placeholder="Alias" />
							</FormField>

							<FormField error={errors.role?.message}>
								<FormSelect
									{...register("role")}
									value={isLeader ? "3" : watchRole}
									disabled={isLeader}
									onChange={
										isLeader
											? undefined
											: (e) => {
													setSelectedRole(e.target.value);
													setValue("role", e.target.value);
											  }
									}
								>
									{isLeader ? (
										<option value="3">Agent</option>
									) : (
										<>
											<option value="">Select Role</option>
											{roleOptions.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</>
									)}
								</FormSelect>
							</FormField>

							{/* Team/Leader selector for agent, fixed for leader */}
							{(watchRole === "3" || isLeader) && (
								<FormField error={errors.leader_id?.message}>
									<FormSelect
										{...register("leader_id")}
										value={
											isLeader
												? String(loggedInUser.id)
												: watch("leader_id") ||
												  (user && user.leader_id ? String(user.leader_id) : "")
										}
										disabled={isLeader || leadersLoading}
										onChange={
											isLeader
												? undefined
												: (e) => setValue("leader_id", e.target.value)
										}
									>
										{isLeader ? (
											<option value={loggedInUser.id}>
												{loggedInUser.name ||
													loggedInUser.alias ||
													loggedInUser.email}
											</option>
										) : (
											<>
												<option value="">
													{leadersLoading ? "Loading..." : "Select Team"}
												</option>
												{!leadersLoading &&
													leaders.map((leader) => (
														<option key={leader.id} value={leader.id}>
															{leader.name || leader.alias || leader.email}
														</option>
													))}
											</>
										)}
									</FormSelect>
								</FormField>
							)}
						</div>

						{/* Photo uploader */}
						<div className="flex flex-col items-center justify-center min-w-[100px]">
							<div
								className={`relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer bg-gray-700 ${
									dragActive
										? "border-blue-400 bg-blue-900/30"
										: "border-gray-500"
								}`}
								onClick={openFileDialog}
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								tabIndex={0}
								role="button"
								aria-label="Upload Photo"
							>
								{photoPreview ? (
									<img
										src={photoPreview}
										alt="Preview"
										className="object-cover w-full h-full rounded-full"
									/>
								) : (
									<div className="flex flex-col items-center justify-center text-gray-400">
										<svg
											className="w-8 h-8 mb-1"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-1a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1z"
											/>
										</svg>
										<span className="text-[10px] text-center">
											Click or Drag & Drop
											<br />
											to upload
										</span>
									</div>
								)}
								<input
									type="file"
									accept="image/*"
									ref={inputFileRef}
									className="absolute inset-0 opacity-0 cursor-pointer"
									style={{ display: "none" }}
									onChange={handleFileInput}
									tabIndex={-1}
								/>
							</div>
						</div>
					</div>

					{/* Bottom fields */}
					<div className="space-y-2">
						<FormField error={errors.email?.message}>
							<FormInput {...register("email")} placeholder="Email" />
						</FormField>{" "}
						{showConfirmEmail && (
							<FormField error={errors.confirmEmail?.message}>
								<FormInput
									{...register("confirmEmail")}
									placeholder="Confirm Email"
								/>
							</FormField>
						)}
						{
							<FormField error={errors.password?.message}>
								<div className="relative">
									<FormInput
										type={showPassword ? "text" : "password"}
										{...register("password")}
										placeholder="Password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3.5 top-2 text-gray-400 hover:text-gray-300"
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</FormField>
						}
						{showConfirmPassword && (
							<FormField error={errors.confirmPassword?.message}>
								<div className="relative">
									<FormInput
										type={showPassword ? "text" : "password"}
										{...register("confirmPassword")}
										placeholder="Confirm Password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3.5 top-2 text-gray-400 hover:text-gray-300"
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</FormField>
						)}
					</div>
				</div>

				{/* Footer actions */}
				<div className="mt-6 flex gap-4 pt-4 border-t border-gray-700">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white hover:opacity-90 transition-all duration-200"
					>
						{user ? "Update User" : "Save User"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
