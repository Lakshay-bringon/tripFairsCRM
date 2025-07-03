import React from "react";
import {
	UserCircle,
	Ticket,
	Users,
	CreditCard,
	DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BOOKING_STATUS } from "../../constants";
export default function BookingCard({ bookingDetails }) {
	const navigate = useNavigate();

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case "3":
				return "text-green-400 bg-green-400/10";
			case "1":
				return "text-yellow-400 bg-yellow-400/10";
			case "2":
				return "text-red-400 bg-red-400/10";
			default:
				return "text-gray-400 bg-gray-400/10";
		}
	};
	const getTransactionTypeLabel = (type) => {
		if (!type) return "N/A";

		// Convert snake_case to proper case
		return type
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<div
			className="p-4 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group border-b border-gray-700 last:border-b-0"
			onClick={() => navigate(`/find-bookings/${bookingDetails.bid}`)}
		>
			<div className="flex items-start justify-between">
				{/* Left Side - Main Info */}
				<div className="flex items-center space-x-3">
					<div className="p-2 bg-gray-700 rounded-lg">
						<Ticket className="w-8 h-8 text-blue-400" />
					</div>
					<div>
						<div className="text-white font-medium text-base">
							{bookingDetails.bid}
						</div>
						<div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
							<span className="flex items-center">
								PNR:{" "}
								<span className="text-white ml-1">{bookingDetails.pnr}</span>
							</span>

							<span className="flex items-center">
								<CreditCard className="w-3 h-3 mr-1" />
								{bookingDetails.cchName}
							</span>
						</div>
					</div>
				</div>

				{/* Right Side - Tags and Additional Info */}
				<div className="flex flex-col items-end gap-2">
					<div className="flex items-center gap-2">
						<span
							className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
								bookingDetails.bid_status
							)}`}
						>
							{BOOKING_STATUS[bookingDetails.bid_status]}
						</span>{" "}
						<span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
							{getTransactionTypeLabel(bookingDetails.transaction_type)}
						</span>
					</div>{" "}
					<div className="flex items-center gap-3 text-xs text-gray-400">
						<span className="flex items-center">
							<UserCircle className="w-3 h-3 mr-1" />
							Created by: {bookingDetails.userName}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
