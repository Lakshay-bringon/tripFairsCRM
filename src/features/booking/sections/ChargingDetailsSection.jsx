import React, { useState, useEffect, useCallback } from 'react';
import Section from '../Section';
import { useEditingContext } from '../context/EditingContext';
import {
	formatSafeDate,
	formatLocalDateString,
	formatESTDateForInput,
} from '../../../utils/formatters';
import { CHARGING_STATUS, CHARGING_TYPE } from '../../../constants';
import { useNavigate } from 'react-router-dom';
const SECTION_ID = 'charging-details';

const ChargingDetailsSection = React.memo(({ apiData, onSave }) => {
	const navigate = useNavigate();
	const { startEditing, stopEditing } = useEditingContext();
	const [chargingDetails, setChargingDetails] = useState([
		{
			type: 'MCO',
			amount: '0.00',
			status: 0,
			chargedOn: '',
			chargedBy: '',
			merchantName: '',
			refundedOn: '',
			transactionId: '',
			description: '',
		},
	]); // Update state when booking data is loaded
	useEffect(() => {
		if (apiData) {
			// Check if new data structure exists (chargingDetailsData)
			if (apiData.chargingDetailsData) {
				const chargingDetailsData = JSON.parse(apiData.chargingDetailsData);
				// console.log("Charging Details Data:", chargingDetailsData["MCO"]);
				setChargingDetails([
					...(Array.isArray(chargingDetailsData?.airlineCharge)
						? chargingDetailsData.airlineCharge
						: []),
					...(Array.isArray(chargingDetailsData?.MCO)
						? chargingDetailsData.MCO
						: []),
				]);
			}
		}
	}, [apiData]);

	useEffect(() => {
		// console.log('Charging Details Updated:', chargingDetails);
	}, [chargingDetails]);

	const handleEmailAction = (emailType, detail) => {
		navigate(`/email-preview`, {
			state: {
				emailType,
				bid: apiData?.bid,
				providerId: apiData?.provider_id,
				formData: detail,
				transactionType: apiData?.transaction_type,
			},
		});
	};

	const handleSave = useCallback(async () => {
		if (onSave) {
			// Group transactions by type
			const groupedDetails = chargingDetails.reduce((acc, detail) => {
				const key = detail.type === 'Airline Charge' ? 'airlineCharge' : 'MCO';
				if (!acc[key]) acc[key] = [];
				acc[key].push({
					type: detail.type,
					transactionId: detail.transactionId,
					amount: detail.amount,
					status: detail.status,
					chargedOn: detail.chargedOn,
					chargedBy: detail.chargedBy,
					merchantName: detail.merchantName,
					description: detail.description,
				});
				return acc;
			}, {}); // Construct the payload
			const saveData = {
				bid: apiData?.bid || '',
				chargingDetailsData: groupedDetails,
			};
			// console.log('Save Data:', saveData);

			await onSave(saveData);
		}
	}, [onSave, chargingDetails, apiData]);

	const handleEditStart = useCallback(() => {
		startEditing(SECTION_ID);
	}, [startEditing]);

	const handleEditCancel = useCallback(() => {
		stopEditing(SECTION_ID);
	}, [stopEditing]);
	const handleEditSave = useCallback(() => {
		stopEditing(SECTION_ID);
	}, [stopEditing]);

	const addNewTransaction = useCallback(() => {
		setChargingDetails((prev) => [
			...prev,
			{
				type: 'MCO',
				amount: '0.00',
				status: 0,
				chargedOn: '',
				chargedBy: '',
				merchantName: '',
				refundedOn: '',
				transactionId: '',
				description: '',
			},
		]);
	}, []);

	const removeTransaction = useCallback((index) => {
		setChargingDetails((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const updateChargingDetail = useCallback((index, field, value) => {
		setChargingDetails((prev) =>
			prev.map((detail, i) =>
				i === index ? { ...detail, [field]: value } : detail
			)
		);
	}, []);

	return (
		<Section
			title="Charging Details"
			editable={true}
			onSave={handleSave}
			onEditStart={handleEditStart}
			onEditCancel={handleEditCancel}
			onEditSave={handleEditSave}
		>
			{(isEditing) => (
				<div className="p-3 space-y-3">
					{/* Add Transaction Button */}
					{isEditing && (
						<div className="flex justify-end mb-3">
							<button
								type="button"
								onClick={addNewTransaction}
								className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1"
							>
								<span>+</span>
								Add Transaction
							</button>
						</div>
					)}
					{/* Render each charging detail */}
					{chargingDetails?.map((detail, index) => (
						<div
							key={index}
							className="border border-gray-600 rounded-lg p-3 space-y-3"
						>
							{/* Transaction Header */}
							<div className="flex justify-between items-center">
								<h4 className="text-white font-medium text-sm">
									Transaction {index + 1}
								</h4>
								{isEditing && chargingDetails.length > 1 && (
									<button
										type="button"
										onClick={() => removeTransaction(index)}
										className="text-red-400 hover:text-red-300 text-xs"
									>
										Remove
									</button>
								)}
								{!isEditing &&
									detail.status ===
										CHARGING_STATUS.indexOf('Declined').toString() && (
										<button
											type="button"
											onClick={() => handleEmailAction('declined', detail)}
											className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1"
										>
											Send Card Decline Email
										</button>
									)}
							</div>
							{/* Send Card Decline Email Button */}

							<div className="grid text-white grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
								{' '}
								{/* Type Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										TYPE
									</label>
									<div className="h-7">
										{isEditing ? (
											<select
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
												value={detail.type}
												onChange={(e) =>
													updateChargingDetail(index, 'type', e.target.value)
												}
											>
												<option value="">Select type</option>
												{CHARGING_TYPE.map((type, typeIndex) => (
													<option key={typeIndex} value={typeIndex}>
														{type}
													</option>
												))}
											</select>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													{detail.type !== undefined && detail.type !== null
														? CHARGING_TYPE[detail.type] || detail.type
														: 'N/A'}
												</div>
											</div>
										)}
									</div>
								</div>
								{/* Transaction ID Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										TRANSACTION ID
									</label>
									<div className="h-7">
										{isEditing ? (
											<input
												type="text"
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
												value={detail.transactionId || ''}
												onChange={(e) =>
													updateChargingDetail(
														index,
														'transactionId',
														e.target.value
													)
												}
												placeholder="Transaction ID"
											/>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													{detail.transactionId || 'N/A'}
												</div>
											</div>
										)}
									</div>
								</div>
								{/* Amount Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										AMOUNT
									</label>
									<div className="h-7">
										{isEditing ? (
											<input
												type="number"
												step="0.01"
												min="0"
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
												value={detail.amount || ''}
												onChange={(e) =>
													updateChargingDetail(index, 'amount', e.target.value)
												}
												placeholder="0.00"
											/>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													${detail.amount || '0.00'}
												</div>
											</div>
										)}
									</div>
								</div>
								{/* Status Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										STATUS
									</label>
									<div className="h-7">
										{isEditing ? (
											<select
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
												value={detail.status ?? ''}
												onChange={(e) =>
													updateChargingDetail(index, 'status', e.target.value)
												}
											>
												<option value="">Select Status</option>
												{CHARGING_STATUS.map((status, statusIndex) => (
													<option key={statusIndex} value={statusIndex}>
														{status}
													</option>
												))}
											</select>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													{detail.status !== undefined && detail.status !== null
														? CHARGING_STATUS[detail.status] || detail.status
														: 'N/A'}
												</div>
											</div>
										)}
									</div>
								</div>
								{/* Charged On Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										CHARGED ON
									</label>
									<div className="h-7 relative">
										{isEditing ? (
											<input
												type="date"
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs z-10"
												value={detail.chargedOn}
												onChange={(e) =>
													updateChargingDetail(
														index,
														'chargedOn',
														e.target.value
													)
												}
												max={formatESTDateForInput()}
											/>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													{formatSafeDate(detail.chargedOn)}
												</div>
											</div>
										)}
									</div>
								</div>
								{/* Charged By Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										CHARGED BY
									</label>
									<div className="h-7">
										{isEditing ? (
											<input
												type="text"
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
												value={detail.chargedBy || ''}
												onChange={(e) =>
													updateChargingDetail(
														index,
														'chargedBy',
														e.target.value
													)
												}
												placeholder="Charged by"
											/>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													{detail.chargedBy || 'N/A'}
												</div>
											</div>
										)}
									</div>
								</div>
								{/* Merchant Name Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										MERCHANT NAME
									</label>
									<div className="h-7">
										{isEditing ? (
											<input
												type="text"
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
												value={detail.merchantName || ''}
												onChange={(e) =>
													updateChargingDetail(
														index,
														'merchantName',
														e.target.value
													)
												}
												placeholder="Merchant name"
											/>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													{detail.merchantName || 'N/A'}
												</div>
											</div>
										)}
									</div>
								</div>{' '}
								{/* Description Field */}
								<div>
									<label className="block text-gray-400 text-xs mb-1">
										DESCRIPTION
									</label>
									<div className="h-7">
										{isEditing ? (
											<input
												type="text"
												className="w-full h-full bg-gray-700 text-white rounded px-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-xs"
												value={detail.description || ''}
												onChange={(e) =>
													updateChargingDetail(
														index,
														'description',
														e.target.value
													)
												}
												placeholder="Transaction description"
											/>
										) : (
											<div className="h-full flex items-center px-2 bg-gray-700/50 rounded text-xs">
												<div className="text-white">
													{detail.description || 'N/A'}
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</Section>
	);
});

ChargingDetailsSection.displayName = 'ChargingDetailsSection';

export default ChargingDetailsSection;
