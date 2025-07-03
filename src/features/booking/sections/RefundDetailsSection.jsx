import React, { useState, useEffect, useCallback } from "react";
import Section from "../Section";
import { useEditingContext } from "../context/EditingContext";
import {
	formatSafeDate,
	formatLocalDateString,
} from "../../../utils/formatters";
import { REFUND_STATUS } from "../../../constants";

const SECTION_ID = "refund-details";

const RefundDetailsSection = React.memo(({ apiData, onSave }) => {
	const { startEditing, stopEditing } = useEditingContext();

	const [refundDetails, setRefundDetails] = useState([
		{
			amount: "0.00",
			refundedOn: "",
			status: 0,
		},
	]);

	// Update state when booking data is loaded
	useEffect(() => {
		if (apiData) {
			setRefundDetails([
				{
					amount: apiData.refundDetailsAmount || "0.00",
					refundedOn: apiData.refundDetailsRefundOn || "",
					status: apiData.refundDetailsStatus || 0,
				},
			]);
		}
	}, [apiData]);

	const handleSave = useCallback(async () => {
		if (onSave) {
			await onSave({
				refundDetailsAmount: refundDetails[0].amount,
				refundDetailsRefundOn: refundDetails[0].refundedOn,
				refundDetailsStatus: refundDetails[0].status,
			});
		}
	}, [onSave, refundDetails]);

	const handleEditStart = useCallback(() => {
		startEditing(SECTION_ID);
	}, [startEditing]);

	const handleEditCancel = useCallback(() => {
		stopEditing(SECTION_ID);
	}, [stopEditing]);

	const handleEditSave = useCallback(() => {
		stopEditing(SECTION_ID);
	}, [stopEditing]);

	return (
		<Section
			title="Refund Details"
			editable={true}
			onSave={handleSave}
			onEditStart={handleEditStart}
			onEditCancel={handleEditCancel}
			onEditSave={handleEditSave}
		>
			{(isEditing) => (
				<div className="p-3 space-y-4">
					<div className="grid text-white grid-cols-1 md:grid-cols-3 gap-3">
						<div>
							<label className="block text-gray-400 text-xs mb-1">AMOUNT</label>
							<div className="h-8">
								{isEditing ? (
									<input
										key="refund-amount-number-input"
										type="number"
										step="0.01"
										className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
										value={refundDetails[0].amount}
										onChange={(e) =>
											setRefundDetails((rd) => [
												{ ...rd[0], amount: e.target.value },
											])
										}
										onFocus={(e) => {
											// Ensure input type remains number
											e.target.type = "number";
										}}
									/>
								) : (
									<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
										<div className="text-white">${refundDetails[0].amount}</div>
									</div>
								)}
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">
								REFUNDED ON
							</label>
							<div className="h-8 relative">
								{isEditing ? (
									<input
										key="refund-date-input"
										type="date"
										className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-sm z-10"
										value={formatLocalDateString(refundDetails[0]?.refundedOn)}
										onChange={(e) =>
											setRefundDetails((rd) => [
												{ ...rd[0], refundedOn: e.target.value },
											])
										}
									/>
								) : (
									<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
										<div className="text-white">
											{formatSafeDate(refundDetails[0].refundedOn)}
										</div>
									</div>
								)}
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">STATUS</label>
							<div className="h-8">
								{isEditing ? (
									<select
										className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
										value={refundDetails[0].status}
										onChange={(e) =>
											setRefundDetails((rd) => [
												{ ...rd[0], status: e.target.value },
											])
										}
									>
										<option value="">Select Status</option>
										{REFUND_STATUS.map((status, index) => (
											<option key={index} value={index}>
												{status}
											</option>
										))}
									</select>
								) : (
									<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
										<div className="text-white">
											{refundDetails[0].status !== undefined &&
											refundDetails[0].status !== null
												? REFUND_STATUS[refundDetails[0].status] ||
												  refundDetails[0].status
												: "N/A"}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</Section>
	);
});

RefundDetailsSection.displayName = "RefundDetailsSection";

export default RefundDetailsSection;
