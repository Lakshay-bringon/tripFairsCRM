import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TRANSACTION_TYPES } from "../../constants";
import NewBooking from "../../features/booking/components/NewBooking";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";

const formSchema = z.object({
	transactionType: z
		.string()
		.min(1, { message: "Transaction type is required" }),
	providerId: z.string().min(1, { message: "Provider is required" }),
	queueId: z.string().min(1, { message: "Call Queue is required" }),
});

function ManageBookings() {
	const {
		providers,
		callQueues,
		providersLoading,
		callQueuesLoading,
		fetchProviders,
		fetchCallQueues,
	} = useDataContext();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [formData, setFormData] = useState(null);
	const transactionTypeInputRef = useRef(null);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(formSchema),
	});

	React.useEffect(() => {
		fetchProviders();
		fetchCallQueues();
	}, []);

	const onSubmit = (data) => {
		switch (data.transactionType) {
			case "new_booking":
				navigate("/manage-bookings/new-booking", { state: data });
				break;
			case "exchange":
				navigate("/manage-bookings/exchange", { state: data });
				break;
			case "seat_assignment":
				navigate("/manage-bookings/seat-assignment", { state: data });
				break;
			case "upgrade":
				navigate("/manage-bookings/upgrade", { state: data });
				break;
			case "cancel_for_refund":
				navigate("/manage-bookings/cancel-for-refund", { state: data });
				break;
			case "cancel_for_future_credit":
				navigate("/manage-bookings/cancel-for-future-credit", { state: data });
				break;
			case "extra_add_ons":
				navigate("/manage-bookings/extra-add-ons", { state: data });
				break;
			case "ticket_issuance":
				navigate("/manage-bookings/ticket-issuance", { state: data });
				break;
		}

		setFormData(data);
		setShowConfirmation(true);
	};

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-4 p-4 rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700 shadow-xl">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label
							htmlFor="transactionType"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Transaction Type
						</label>
						<select
							ref={transactionTypeInputRef}
							id="transactionType"
							{...register("transactionType")}
							className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
						>
							<option value="">Select Transaction Type</option>
							{Object.entries(TRANSACTION_TYPES).map(([key, value]) => (
								<option key={key} value={value}>
									{key
										.split("_")
										.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
										.join(" ")}
								</option>
							))}
						</select>
						{errors.transactionType && (
							<p className="mt-1 text-xs text-red-400">
								{errors.transactionType.message}
							</p>
						)}
					</div>

					<div className="flex gap-4">
						<div className="flex-1">
							<label
								htmlFor="provider"
								className="block text-sm font-medium text-gray-300 mb-1"
							>
								Provider
							</label>
							<select
								id="provider"
								{...register("providerId")}
								className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
								disabled={providersLoading}
							>
								<option value="">
									{providersLoading ? "Loading..." : "Select Provider"}
								</option>
								{!providersLoading &&
									providers.map((provider) => (
										<option key={provider.id} value={provider.id}>
											{provider.name}
										</option>
									))}
							</select>
							{errors.providerId && (
								<p className="mt-1 text-xs text-red-400">
									{errors.providerId.message}
								</p>
							)}
						</div>

						<div className="flex-1">
							<label
								htmlFor="callQueue"
								className="block text-sm font-medium text-gray-300 mb-1"
							>
								Call Queue
							</label>
							<select
								id="callQueue"
								{...register("queueId")}
								className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
								disabled={callQueuesLoading}
							>
								<option value="">
									{callQueuesLoading ? "Loading..." : "Select Call Queue"}
								</option>
								{!callQueuesLoading &&
									callQueues.map((queue) => (
										<option key={queue.id} value={queue.name}>
											{queue.name}
										</option>
									))}
							</select>
							{errors.queueId && (
								<p className="mt-1 text-xs text-red-400">
									{errors.queueId.message}
								</p>
							)}
						</div>
					</div>

					<button
						type="submit"
						className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default ManageBookings;
