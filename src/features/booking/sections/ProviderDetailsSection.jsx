import React, { useState, useEffect, useCallback } from "react";
import Section from "../Section";
import { useEditingContext } from "../context/EditingContext";
import { getESTTimestamp } from "../../../utils/formatters";
import { AUTH_STATUS, BOOKING_STATUS } from "../../../constants";
import { useAuth } from "../../../auth/hooks/useAuth";
const SECTION_ID = "provider-details";

const ProviderDetailsSection = React.memo(({ apiData, onSave }) => {
	const { startEditing, stopEditing } = useEditingContext();
	const { user } = useAuth();
	const [providerDetails, setProviderDetails] = useState({
		bid: "N/A",
		provider: "N/A",
		transactionType: "N/A",
		dateCreated: getESTTimestamp(),
		authStatus: 0,
		bidStatus: 0,
		agent: "N/A",
	});

	// Update state when booking data is loaded
	useEffect(() => {
		if (apiData) {
			setProviderDetails({
				bid: apiData.bid || "",
				provider: apiData.providerName || "",
				transactionType: apiData.transaction_type || "",
				dateCreated: apiData.created_at || new Date().toISOString(),
				authStatus: apiData.auth_status,
				bidStatus: apiData.bid_status,
				agent: apiData.agent || apiData.userName || "",
			});
		}
	}, [apiData]);

	const handleSave = useCallback(async () => {
		if (onSave) {
			await onSave({
				bid: providerDetails.bid,
				userId: user?.id || "",
				bidStatus: providerDetails.bidStatus,
			});
		}
	}, [onSave, providerDetails]);

	const handleEditStart = useCallback(() => {
		startEditing(SECTION_ID);
	}, [startEditing]);

	const handleEditCancel = useCallback(() => {
		stopEditing(SECTION_ID);
	}, [stopEditing]);

	const handleEditSave = useCallback(() => {
		stopEditing(SECTION_ID);
	}, [stopEditing]);

	// Get all available status indices for the select options
	const availableStatusIndices = [0, 1, 2, 3]; // All options including Ticketed & MCO Charged

	return (
		<Section
			title="Provider Details"
			editable={true}
			onSave={handleSave}
			onEditStart={handleEditStart}
			onEditCancel={handleEditCancel}
			onEditSave={handleEditSave}
		>
			{(isEditing) => (
				<div className="p-3 space-y-4">
					<div className="grid text-white grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<div>
							<label className="block text-gray-400 text-xs mb-1">BID</label>
							<div className="h-8 flex items-center px-2 bg-gray-700/50 rounded text-sm">
								<div className="text-white">{providerDetails.bid}</div>
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">
								PROVIDER
							</label>
							<div className="h-8">
								<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
									<div className="text-white">{providerDetails.provider}</div>
								</div>
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">
								TRANSACTION TYPE
							</label>
							<div className="h-8 flex items-center px-2 bg-gray-700/50 rounded text-sm">
								<div className="text-white">
									{providerDetails.transactionType}
								</div>
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">
								DATE CREATED
							</label>{" "}
							<div className="h-8 flex items-center px-2 bg-gray-700/50 rounded text-sm">
								<div className="text-white">{providerDetails.dateCreated}</div>
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">
								AUTH STATUS
							</label>
							<div className="h-8">
								<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
									<div className="text-white">
										{providerDetails.authStatus !== undefined &&
										providerDetails.authStatus !== null
											? AUTH_STATUS[providerDetails.authStatus] ||
											  providerDetails.authStatus
											: "N/A"}
									</div>
								</div>
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">
								BID STATUS
							</label>
							<div className="h-8">
								{isEditing ? (
									<>
										<select
											className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
											value={providerDetails.bidStatus}
											onChange={(e) =>
												setProviderDetails((pd) => ({
													...pd,
													bidStatus: e.target.value,
												}))
											}
										>
											<option value="">Select Status</option>
											{availableStatusIndices.map((index) => (
												<option key={index} value={index}>
													{BOOKING_STATUS[index]}
												</option>
											))}
										</select>
									</>
								) : (
									<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-sm">
										<div className="text-white">
											{providerDetails.bidStatus !== undefined &&
											providerDetails.bidStatus !== null
												? BOOKING_STATUS[providerDetails.bidStatus] ||
												  providerDetails.bidStatus
												: "N/A"}
										</div>
									</div>
								)}
							</div>
						</div>
						<div>
							<label className="block text-gray-400 text-xs mb-1">AGENT</label>
							<div className="h-8 flex items-center px-2 bg-gray-700/50 rounded text-sm">
								<div className="text-white">{providerDetails.agent}</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</Section>
	);
});

ProviderDetailsSection.displayName = "ProviderDetailsSection";

export default ProviderDetailsSection;
