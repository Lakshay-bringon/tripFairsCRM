import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import BookingDetailsHeader from "./BookingDetailsHeader";
import ImagePreviewModal from "./ImagePreviewModal";
import { LoadingSpinner } from "../../components/ui";
import {
	getBookingByBid,
	updateBookingProviderDetails,
	updateRefundDetails,
	updateChargebackDetails,
	updateBookingChargingDetails,
} from "../../api/booking/bookingApi";
import { showPromiseToast } from "../../utils/showPromiseToast";
import { useAuth } from "../../auth/hooks/useAuth";

// Import section components
import ProviderDetailsSection from "./sections/ProviderDetailsSection";
import ChargingDetailsSection from "./sections/ChargingDetailsSection";
import RefundDetailsSection from "./sections/RefundDetailsSection";
import ChargebackDetailsSection from "./sections/ChargebackDetailsSection";
import FormSection from "./sections/FormSection";

// Import context
import { EditingProvider, useEditingContext } from "./context/EditingContext";

// Import form components
import NewBooking from "./components/NewBooking";
import Exchange from "./components/Exchange";
import CancelForFutureCredit from "./components/CancelForFutureCredit";
import CancelForRefund from "./components/CancelForRefund";
import Upgrade from "./components/Upgrade";
import SeatAssignment from "./components/SeatAssignment";

// Inner component that has access to editing context
function BookingDetailsContent() {
	const { bid } = useParams(); // Extract 'bid'
	const { user } = useAuth();
	const { isAnySectionEditing } = useEditingContext();
	const [previewImage, setPreviewImage] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [apiData, setApiData] = useState(null);

	// Fetch booking details function
	const fetchBookingDetails = async () => {
		if (!bid) {
			setError("No booking ID provided");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const data = await showPromiseToast(getBookingByBid(bid), {
				loading: "Loading booking details...",
				success: "Booking details loaded successfully!",
				error: "Failed to load booking details",
			});
			// console.log(data);
			setApiData(data);
		} catch (err) {
			setError(err.message || "Failed to load booking details");
			// console.error("Error fetching booking details:", err);
		} finally {
			setLoading(false);
		}
	};

	// Fetch booking details on mount
	useEffect(() => {
		fetchBookingDetails();
	}, [bid]);

	// Handle refresh
	const handleRefresh = () => {
		fetchBookingDetails();
	};

	// Save provider details function
	const saveProviderDetails = async (updateData) => {
		try {
			const payload = {
				bid: apiData?.BID || apiData?.bid,
				bid_status: updateData.bidStatus,
				userId: user?.id,
			};

			await showPromiseToast(updateBookingProviderDetails(payload), {
				loading: "Updating provider details...",
				success: "Provider details updated successfully!",
				error: "Failed to update provider details",
			});

			// Refresh booking data after successful update
			fetchBookingDetails();
		} catch (err) {
			// console.error('Error updating provider details:', err);
		}
	};

	// Save refund details function
	const saveRefundDetails = async (updateData) => {
		try {
			const payload = {
				bid: apiData?.BID || apiData?.bid,
				refundDetailsAmount: updateData.refundDetailsAmount,
				refundDetailsRefundOn: updateData.refundDetailsRefundOn,
				refundDetailsStatus: updateData.refundDetailsStatus,
				userId: user?.id,
			};

			await showPromiseToast(updateRefundDetails(payload), {
				loading: "Updating refund details...",
				success: "Refund details updated successfully!",
				error: "Failed to update refund details",
			});

			// Refresh booking data after successful update
			fetchBookingDetails();
		} catch (err) {
			// console.error('Error updating refund details:', err);
		}
	};

	// Save chargeback details function
	const saveChargebackDetails = async (updateData) => {
		try {
			const payload = {
				bid: apiData?.BID || apiData?.bid,
				chargebackDetailsAmount: updateData.chargebackDetailsAmount,
				chargebackDetailsChargedOn: updateData.chargebackDetailsChargedOn,
				chargebackDetailsStatus: updateData.chargebackDetailsStatus,
				userId: user?.id,
			};

			await showPromiseToast(updateChargebackDetails(payload), {
				loading: "Updating chargeback details...",
				success: "Chargeback details updated successfully!",
				error: "Failed to update chargeback details",
			});

			// Refresh booking data after successful update
			fetchBookingDetails();
		} catch (err) {
			// console.error('Error updating chargeback details:', err);
		}
	};

	// Save charging details function
	const saveChargingDetails = async (updateData) => {
		try {
			// console.log('BookingDetails - Received updateData:', updateData);

			// The updateData now contains: { bid, chargingDetailsData, userId }
			const payload = {
				bid: updateData.bid || apiData?.BID || apiData?.bid,
				chargingDetailsData: updateData.chargingDetailsData,
				userId: updateData.userId || user?.id,
			};

			// console.log('BookingDetails - Sending payload to API:', payload);

			await showPromiseToast(updateBookingChargingDetails(payload), {
				loading: "Updating charging details...",
				success: "Charging details updated successfully!",
				error: "Failed to update charging details",
			});

			// Refresh booking data after successful update
			fetchBookingDetails();
		} catch (err) {
			// console.error('Error updating charging details:', err);
		}
	};

	// Memoize bookingDataForForm to avoid new object reference on every render
	const bookingDataForForm = useMemo(() => {
		if (!apiData) return null;

		// Handle itinerary_details - which is a JSON stringified array
		let processedItinerary = []; // Default to an empty array
		if (apiData?.itinerary_details) {
			if (Array.isArray(apiData.itinerary_details)) {
				// If it's already a JS array, use it directly
				processedItinerary = apiData.itinerary_details;
			} else if (typeof apiData.itinerary_details === "string") {
				try {
					// console.log(apiData.itinerary_details);
					// Parse the JSON string to get the array
					const parsed = JSON.parse(apiData.itinerary_details);
					// We're certain it's an array, but check just to be safe
					processedItinerary = Array.isArray(parsed) ? parsed : [parsed];
					// console.log(
					// 	'Successfully parsed itinerary_details:',
					// 	processedItinerary
					// );
				} catch (e) {
					// Log error for debugging
					// console.error(
					// 	'Failed to parse itinerary_details:',
					// 	e,
					// 	apiData.itinerary_details
					// );
					// Fallback to treating it as a single item
					// processedItinerary = [apiData.itinerary_details];
				}
			}
		}

		const hidePurchaseSummary =
			(user?.role_id === 3 || user?.role_id === "3") &&
			user?.id &&
			apiData?.agent_id &&
			String(user.id) !== String(apiData?.agent_id);

		return {
			transaction_type: apiData?.transaction_type,
			...apiData?.bookingData,
			image_itinerary: processedItinerary,
			attachments: apiData?.attachments || [],
			bid: apiData?.bid,
			agent_name: apiData?.userName,
			hidePurchaseSummary: hidePurchaseSummary,
		};
	}, [apiData]);

	const renderFormComponent = useCallback(() => {
		// Only render if bookingData is available
		if (apiData === null || apiData === undefined) {
			return (
				<div className="flex items-center justify-center p-8">
					<div className="text-gray-400">Loading form data...</div>
				</div>
			);
		}
		const commonProps = {
			bookingData: bookingDataForForm,
			onRefresh: handleRefresh,
			onBack: () => window.history.back(),
		};

		switch (apiData?.transaction_type) {
			case "new_booking":
				return <NewBooking {...commonProps} />;
			case "exchange":
				return <Exchange {...commonProps} />;
			case "cancel_for_future_credit":
				return <CancelForFutureCredit {...commonProps} />;
			case "cancel_for_refund":
				return <CancelForRefund {...commonProps} />;
			case "upgrade":
				return <Upgrade {...commonProps} />;
			case "seat_assignment":
				return <SeatAssignment {...commonProps} />;
			default:
				return <NewBooking {...commonProps} />;
		}
	}, [apiData, bookingDataForForm, handleRefresh]);

	// Show loading spinner while fetching data
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<LoadingSpinner label="Loading booking details..." size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="text-red-400 text-lg font-medium">
					Error Loading Booking
				</div>
				<div className="text-gray-400 text-center max-w-md">{error}</div>
				<button
					onClick={() => window.history.back()}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Go Back
				</button>
			</div>
		);
	}

	// Show not found state if no booking data is available after loading
	if (!loading && !apiData) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="text-gray-400 text-lg font-medium">
					Booking Not Found
				</div>
				<div className="text-gray-500 text-center">
					The booking with ID "{bid}" could not be found.
				</div>
				<button
					onClick={() => window.history.back()}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Go Back
				</button>
			</div>
		);
	}

	return (
		<>
			<BookingDetailsHeader
				isEditing={isAnySectionEditing}
				formData={bookingDataForForm}
				onRefresh={handleRefresh}
				providerId={apiData?.provider_id}
				bid_status={apiData?.bid_status}
			/>
			{!apiData ? (
				<div className="flex items-center justify-center min-h-[200px]">
					<LoadingSpinner label="Loading booking content..." />
				</div>
			) : (
				<div className="space-y-4">
					{/* Provider Details Section */}
					<ProviderDetailsSection
						apiData={apiData}
						onSave={saveProviderDetails}
					/>
					{/* Charging Details Section */}
					<ChargingDetailsSection
						apiData={apiData}
						onSave={saveChargingDetails}
					/>
					{/* Refund Details Section */}
					<RefundDetailsSection apiData={apiData} onSave={saveRefundDetails} />
					{/* Chargeback Details Section */}
					<ChargebackDetailsSection
						apiData={apiData}
						onSave={saveChargebackDetails}
					/>{" "}
					{/* Form Section */}
					<FormSection renderFormComponent={renderFormComponent} />
				</div>
			)}
			{showPreview && (
				<ImagePreviewModal
					isOpen={showPreview}
					onClose={() => setShowPreview(false)}
					imageUrl={previewImage}
				/>
			)}
		</>
	);
}

// Main component with EditingProvider
export default function BookingDetails() {
	return (
		<EditingProvider>
			<BookingDetailsContent />
		</EditingProvider>
	);
}
