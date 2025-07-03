import React from "react";
import { useDataContext } from "../../../context/DataContext";
import { useHasRole } from "../../../auth/hooks/useRole";
function PurchaseSummary({
	register,
	watch,
	setValue,
	hidePurchaseSummary,
	isEditMode,
}) {
	const { cards, fetchCards } = useDataContext(); // Function to format date from YYYY-MM-DD to MM/DD/YYYY (US format)
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return dateString; // Return original if invalid
		return date.toLocaleDateString("en-US"); // Always MM/DD/YYYY format
	};
	// console.log(hidePurchaseSummary);
	// Watch the purchase_date value
	const purchaseDate = watch("purchase_date");
	const isAgent = useHasRole("agent");
	// console.log(isAgent);

	React.useEffect(() => {
		fetchCards();
	}, []);

	if (hidePurchaseSummary) {
		return (
			<>
				<div className="p-3 border border-gray-700 rounded-lg">
					<h3 className="font-semibold mb-2">Purchase Summary</h3>
					<input type="hidden" {...register("card_holder")} />
					<input type="hidden" {...register("card_number")} />
					<input type="hidden" {...register("email")} />
					<input type="hidden" {...register("phone")} />
					<input type="hidden" {...register("payment_method")} />
					<input type="hidden" {...register("purchase_date")} />
					<input type="hidden" {...register("billing_address")} />
					<input type="hidden" {...register("city")} />
					<input type="hidden" {...register("state")} />
					<input type="hidden" {...register("zip")} />
					<input type="hidden" {...register("country")} />
					<div className="text-red-500 font-semibold mb-3">
						You are not allowed to see this info.
					</div>
				</div>
			</>
		);
	}

	return (
		<div className="p-3 border border-gray-700 rounded-lg">
			<h3 className="font-semibold mb-2">Purchase Summary</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div>
					<label className="inline-block w-32">Card Holder Name:</label>
					<input
						{...register("card_holder")}
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
					/>
				</div>{" "}
				<div>
					<label className="inline-block w-32">Card Type:</label>
					<select
						{...register("payment_method")}
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
					>
						{cards?.map((card) => (
							<option key={card.id || card.name} value={card.name}>
								{card.name}
							</option>
						))}
					</select>
				</div>{" "}
				<div>
					<label className="inline-block w-32">Card Number:</label>
					<input
						{...register("card_number")}
						type={isEditMode && isAgent ? "password" : "text"}
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
						maxLength={19}
					/>
				</div>
				<div>
					<label className="inline-block w-32">CVV Number:</label>
					<input
						{...register("card_cvv")}
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
					/>
				</div>
				<div>
					<label className="inline-block w-32">Expiration Date:</label>
					<input
						{...register("card_expiration")}
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
					/>
				</div>
				<div>
					<label className="inline-block w-32">Email:</label>
					<input
						type="email"
						{...register("email")}
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
					/>
				</div>
				<div>
					<label className="inline-block w-32">Contact No:</label>
					<input
						{...register("phone")}
						type="tel"
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
					/>
				</div>
				<div>
					<label className="inline-block w-32">Purchase Date:</label>
					<input
						{...register("purchase_date")}
						value={formatDate(purchaseDate)}
						className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full md:w-60"
					/>
				</div>
				{/* Address fields - American address style, multi-line, organized */}
				<div className="md:col-span-2">
					<label className="inline-block w-32 mb-1">Address:</label>
					<div className="grid grid-cols-1  gap-2 mb-2">
						<input
							{...register("billing_address", { required: true })}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
							placeholder="Billing Address"
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
						<input
							{...register("city", { required: true })}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
							placeholder="City*"
						/>
						<input
							{...register("state", { required: true })}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
							placeholder="State*"
							// maxLength={2}
							style={{ textTransform: "uppercase" }}
						/>
						<input
							{...register("zip", { required: true })}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
							placeholder="ZIP Code*"
							maxLength={10}
						/>
						<input
							{...register("country", { required: true })}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
							placeholder="Country*"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PurchaseSummary;
