import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Create dynamic schema based on edit mode
const createProviderSchema = (isEditMode) => {
	return z.object({
		name: z.string().min(1, "Provider name is required"),
		logo_base64: isEditMode
			? z.string().optional() // Optional in edit mode
			: z.string().min(1, "Logo is required"), // Required in create mode
		// status removed
		datetime: z.string(),
		support_email: z.string().email("Support email is required"),
		smtp_host: z.string().min(1, "SMTP Host is required"),
		smtp_email: z.string().email("SMTP Email is required"),
		smtp_password: z.string({ required_error: "SMTP Password is required" }), // no min length
		domain: z.string().min(1, "Domain is required"),
	});
};

export default function ProviderForm({ initialData = {}, onSubmit, onCancel }) {
	// Determine if we're in edit mode (has existing data with an id)
	const isEditMode = Boolean(initialData && initialData.id);

	const [logoPreview, setLogoPreview] = useState(
		initialData.logo_base64
			? `data:image/png;base64,${initialData.logo_base64}`
			: ""
	);
	const [logoBase64, setLogoBase64] = useState(initialData.logo_base64 || "");
	const [showPassword, setShowPassword] = useState(false);

	const defaultValues = {
		name: initialData.name || "",

		datetime:
			initialData.datetime ||
			new Date().toISOString().slice(0, 19).replace("T", " "),
		support_email: initialData.support_email || "",
		smtp_host: initialData.smtp_host || "",
		smtp_email: initialData.smtp_email || "",
		smtp_password: initialData.smtp_password || "",
		domain: initialData.domain || "",
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
		setFocus,
		setValue,
	} = useForm({
		resolver: zodResolver(createProviderSchema(isEditMode)),
		defaultValues,
		mode: "onBlur",
	});

	useEffect(() => {
		setFocus("name");
	}, [setFocus]);

	// Handle image upload and convert to base64
	const handleLogoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				const base64 = ev.target.result.split(",")[1];
				setLogoBase64(base64);
				setLogoPreview(ev.target.result);
				setValue("logo_base64", base64);
			};
			reader.readAsDataURL(file);
		}
	};
	const onFormSubmit = (data) => {
		onSubmit({ ...data, logo_base64: logoBase64 });
	};

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className="space-y-4 max-h-[80vh] overflow-y-auto w-full"
		>
			<div className="max-w-2xl px-2 mx-auto w-full">
				<div>
					<label className="block text-sm text-gray-300">Provider Name</label>
					<input
						{...register("name")}
						// ref={nameRef} // Remove ref to avoid double registration
						className="w-full px-3 py-2 rounded bg-gray-700 text-white"
						required
					/>
					{errors.name && (
						<p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
					)}
				</div>{" "}
				<div>
					<label className="block text-sm text-gray-300">
						Provider Logo{" "}
						{isEditMode && <span className="text-gray-400">(optional)</span>}
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleLogoChange}
						className="w-full px-3 py-2 rounded bg-gray-700 text-white"
					/>
					{logoPreview && (
						<img
							src={logoPreview}
							alt="Logo Preview"
							className="h-12 w-12 mt-2 rounded border border-gray-600 object-contain bg-white"
						/>
					)}
					{/* Show validation error for logo */}
					{errors.logo_base64 && (
						<p className="text-xs text-red-400 mt-1">
							{errors.logo_base64.message}
						</p>
					)}
				</div>
				{/* Status input removed */}
				<input type="hidden" {...register("datetime")} />
				<div className="mb-2">
					<label className="block text-sm text-gray-300">Support Email</label>
					<input
						{...register("support_email")}
						className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{errors.support_email && (
						<p className="text-xs text-red-400 mt-1">
							{errors.support_email.message}
						</p>
					)}
				</div>
				<div className="mb-2">
					<label className="block text-sm text-gray-300">SMTP Host</label>
					<input
						{...register("smtp_host")}
						className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{errors.smtp_host && (
						<p className="text-xs text-red-400 mt-1">
							{errors.smtp_host.message}
						</p>
					)}
				</div>
				<div className="mb-2">
					<label className="block text-sm text-gray-300">SMTP Email</label>
					<input
						{...register("smtp_email")}
						className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{errors.smtp_email && (
						<p className="text-xs text-red-400 mt-1">
							{errors.smtp_email.message}
						</p>
					)}
				</div>
				<div className="mb-2">
					<label className="block text-sm text-gray-300">SMTP Password</label>
					<div className="relative flex items-center">
						<input
							type={showPassword ? "text" : "password"}
							{...register("smtp_password")}
							className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
							required
						/>
						<button
							type="button"
							tabIndex={-1}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-blue-400"
							onClick={() => setShowPassword((v) => !v)}
							style={{
								background: "none",
								border: "none",
								padding: 0,
								cursor: "pointer",
							}}
						>
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					{errors.smtp_password && (
						<p className="text-xs text-red-400 mt-1">
							{errors.smtp_password.message}
						</p>
					)}
				</div>
				<div className="mb-2">
					<label className="block text-sm text-gray-300">Domain</label>
					<input
						{...register("domain")}
						className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{errors.domain && (
						<p className="text-xs text-red-400 mt-1">{errors.domain.message}</p>
					)}
				</div>
				<div className="flex gap-2 justify-end mt-4">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-gray-600 text-white rounded"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded"
					>
						Save
					</button>
				</div>
			</div>
		</form>
	);
}
