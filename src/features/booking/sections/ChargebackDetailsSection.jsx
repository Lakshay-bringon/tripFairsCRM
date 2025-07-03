import React, { useState, useEffect, useCallback } from "react";
import Section from "../Section";
import { useEditingContext } from "../context/EditingContext";
import {
	formatSafeDate,
	formatLocalDateString,
} from "../../../utils/formatters";
import { CHARGEBACK_STATUS } from "../../../constants";

const SECTION_ID = "chargeback-details";

const ChargebackDetailsSection = React.memo(({ apiData, onSave }) => {
	const { startEditing, stopEditing } = useEditingContext();

	const [chargebackDetails, setChargebackDetails] = useState([
		{
			amount: "0.00",
			chargebackDate: "",
			status: 0,
		},
	]);

	// Update state when booking data is loaded
	useEffect(() => {
		if (apiData) {
			setChargebackDetails([
				{
					amount: apiData.chargebackDetailsAmount || "0.00",
					chargebackDate: apiData.chargebackDetailsChargedOn || "",
					status: apiData.chargebackDetailsStatus || 0,
				},
			]);
		}
	}, [apiData]);

	const handleSave = useCallback(async () => {
		if (onSave) {
			await onSave({
				chargebackDetailsAmount: chargebackDetails[0].amount,
				chargebackDetailsChargedOn: chargebackDetails[0].chargebackDate,
				chargebackDetailsStatus: chargebackDetails[0].status,
			});
		}
	}, [onSave, chargebackDetails]);

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
			title="Chargeback Details"
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
										key="chargeback-amount-number-input"
										type="number"
										step="0.01"
										className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
										value={chargebackDetails[0].amount}
										onChange={(e) =>
											setChargebackDetails((cd) => [
												{ ...cd[0], amount: e.target.value },
											])
										}
										onFocus={(e) => {
											// Ensure input type remains number
											e.target.type = "number";
										}}
									/>
								) : (
									<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
										<div className="text-white">
											${chargebackDetails[0].amount}
										</div>
									</div>
								)}
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">
								CHARGEBACK DATE
							</label>
							<div className="h-8 relative">
								{isEditing ? (
									<input
										key="chargeback-date-input"
										type="date"
										className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-sm z-10"
										value={formatLocalDateString(
											chargebackDetails[0]?.chargebackDate
										)}
										onChange={(e) =>
											setChargebackDetails((cd) => [
												{ ...cd[0], chargebackDate: e.target.value },
											])
										}
									/>
								) : (
									<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
										<div className="text-white">
											{formatSafeDate(chargebackDetails[0].chargebackDate)}
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
										value={chargebackDetails[0].status}
										onChange={(e) =>
											setChargebackDetails((cd) => [
												{ ...cd[0], status: e.target.value },
											])
										}
									>
										<option value="">Select Status</option>
										{CHARGEBACK_STATUS.map((status, index) => (
											<option key={index} value={index}>
												{status}
											</option>
										))}
									</select>
								) : (
									<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
										<div className="text-white">
											{chargebackDetails[0].status !== undefined &&
											chargebackDetails[0].status !== null
												? CHARGEBACK_STATUS[chargebackDetails[0].status] ||
												  chargebackDetails[0].status
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

ChargebackDetailsSection.displayName = "ChargebackDetailsSection";

export default ChargebackDetailsSection;
