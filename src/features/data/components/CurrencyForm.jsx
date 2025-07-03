import React, { useEffect, useRef } from "react";

export default function CurrencyForm({ initialData = {}, onSubmit, onCancel }) {
	const [form, setForm] = React.useState({
		currency: "",
		...initialData,
	});
	const currencyRef = useRef(null);

	useEffect(() => {
		if (currencyRef.current) currencyRef.current.focus();
	}, []);

	const handleChange = (e) => {
		setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { currency } = form;
		onSubmit({ currency: currency.trim() });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm text-gray-300">Currency</label>
				<input
					ref={currencyRef}
					name="currency"
					value={form.currency}
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
