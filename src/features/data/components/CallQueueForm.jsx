import React, { useEffect, useRef } from "react";

export default function CallQueueForm({
	initialData = {},
	onSubmit,
	onCancel,
}) {
	const [form, setForm] = React.useState({
		name: initialData.name || "",
		telephone:
			initialData.phone || initialData.telephone || initialData.number || "",
	});
	const nameRef = useRef(null);

	useEffect(() => {
		if (nameRef.current) nameRef.current.focus();
	}, []);

	// Update form state when initialData changes (for edit mode)
	useEffect(() => {
		setForm({
			name: initialData.name || "",
			telephone:
				initialData.phone || initialData.telephone || initialData.number || "",
		});
	}, [initialData]);

	const handleChange = (e) => {
		setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ name: form.name.trim(), phone: form.telephone.trim() });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm text-gray-300">Queue Name</label>
				<input
					ref={nameRef}
					name="name"
					value={form.name}
					onChange={handleChange}
					className="w-full px-3 py-2 rounded bg-gray-700 text-white"
					required
				/>
			</div>
			<div>
				<label className="block text-sm text-gray-300">Phone</label>
				<input
					name="telephone"
					type="tel"
					value={form.telephone}
					onChange={handleChange}
					className="w-full px-3 py-2 rounded bg-gray-700 text-white"
					required
				/>
			</div>
			<div className="flex gap-2 justify-end">
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
		</form>
	);
}
