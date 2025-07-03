import React from "react";
import BookingComponent from "./BookingComponent.jsx";
import ChargesDescription from "./ChargesDescription.jsx";
import ItineraryDetailsInput from "./ItineraryDetailsInput.jsx";
import PurchaseSummary from "./PurchaseSummary.jsx";
import AttachmentsSection from "./AttachmentsSection.jsx";
import AuthorizeSection from "./AuthorizeSection.jsx";
import cancelForRefundSchema from "../schemas/cancelForRefundSchema.js";
import PassengerDetails from "./PassengerDetails.jsx";

function CancelForRefund({ bookingData, onBack, onRefresh }) {
	const RefundForm = ({
		trigger,
		register,
		handleSubmit,
		watch,
		setValue,
		errors,
		onSubmit,
		onInvalid,
		isSubmitting,
		currencies,
		currency,
		setCurrency,
		itineraryDetails,
		setItineraryDetails,
		itineraryImages,
		setItineraryImages,
		showPreview,
		setShowPreview,
		previewImage,
		setPreviewImage,
		attachments,
		setAttachments,
		addPassenger,
		removePassenger,
		addCharge,
		removeCharge,
		onBack,
		isEditMode,
		type,
		hidePurchaseSummary,
	}) => {
		// Watch values for dynamic updates - using the correct field names
		const pnr = watch("pnr");
		const airline = watch("airline_name");
		const passengers = watch("passenger_data");
		const charges = watch("charge_data");

		return (
			<>
				<div className="flex justify-between items-center mb-4">
					<h2
						className={`text-xl font-bold text-white flex items-center gap-2 ${
							isEditMode ? "justify-center w-full" : ""
						}`}
					>
						<input
							{...register("airline_name")}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-40 font-bold text-white mr-2"
							style={{ textTransform: "uppercase" }}
							placeholder="Airline Name"
							value={airline}
							onChange={(e) => setValue("airline_name", e.target.value)}
						/>
						REFUND CONFIRMATION –
						<input
							{...register("pnr")}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-32 font-bold text-white ml-2"
							value={pnr}
							onChange={(e) => setValue("pnr", e.target.value)}
							placeholder="PNR"
						/>
					</h2>
					{!isEditMode && (
						<button
							onClick={onBack}
							className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
						>
							Back
						</button>
					)}
				</div>

				<form
					onSubmit={handleSubmit(onSubmit, onInvalid)}
					className="space-y-6 text-gray-300 text-sm"
					style={{ lineHeight: 2 }}
				>
					<div className="space-y-6">
						<div className="p-3 border border-gray-700 rounded-lg">
							{" "}
							<div className="leading-loose">
								Dear
								<input
									{...register("customer_name")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 60 }}
									placeholder="Customer Name"
								/>
								,
							</div>
							<br />
							<div className="leading-loose">Thank you for contacting us!</div>
							<br />
							<div className="leading-loose">
								You can contact us on this number +1(855) 623-7022 for any
								related request.
							</div>
							<br />
							<div className="leading-loose">
								As per our conversation and as agreed, We have cancelled your
								reservation under Confirmation number
								<input
									{...register("pnr")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 60 }}
									value={pnr}
									onChange={(e) => setValue("pnr", e.target.value)}
									placeholder="PNR"
								/>
								booked on{" "}
								<input
									{...register("airline_name")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 60, textTransform: "uppercase" }}
									placeholder="Airline Name"
									value={airline}
									onChange={(e) => setValue("airline_name", e.target.value)}
								/>{" "}
								and will now submit the request to the airlines/consolidator to
								refund your ticket.
							</div>
							<br />
							<div className="leading-loose">
								Upon the airline's approval and after deducting all
								non-refundable amounts (base fare, penalties, taxes, and fees)
								as per fare rules, you will receive a total refund of
								<input
									{...register("cancellation_refund_amount")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 40 }}
									placeholder="Refund Amount"
								/>{" "}
								<select
									className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white ml-2"
									value={currency}
									onChange={(e) => setCurrency(e.target.value)}
								>
									{currencies && currencies.length > 0 ? (
										currencies.map((currency) => (
											<option key={currency.id} value={currency.Currency}>
												{currency.Currency}
											</option>
										))
									) : (
										<option value="">Select Currency</option>
									)}{" "}
								</select>{" "}
								to your original form of payment used.
							</div>
							<br />
							<div className="leading-loose">
								To process cancellation of your flights for a refund, there will
								be a new charge of
								<input
									{...register("amount")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 40 }}
									placeholder="Total Amount"
								/>{" "}
								<select
									className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white ml-2"
									value={currency}
									onChange={(e) => setCurrency(e.target.value)}
								>
									{currencies && currencies.length > 0 ? (
										currencies.map((currency) => (
											<option key={currency.id} value={currency.Currency}>
												{currency.Currency}
											</option>
										))
									) : (
										<option value="">Select Currency</option>
									)}{" "}
								</select>
								.
							</div>
							<br />
						</div>
						{/* Charges Description Section */}
						<ChargesDescription
							charges={charges}
							register={register}
							currencies={currencies}
							currency={currency}
							addCharge={addCharge}
							removeCharge={removeCharge}
							watch={watch}
						/>{" "}
						<ItineraryDetailsInput
							register={register}
							setValue={setValue}
							heading="Refund Details"
							trigger={trigger}
							images={itineraryImages}
							setImages={setItineraryImages}
							onImageClick={(imageUrl) => {
								setPreviewImage(imageUrl);
								setShowPreview(true);
							}}
						/>
						{/* Passenger Details Section */}{" "}
						<PassengerDetails
							passengers={passengers}
							register={register}
							setValue={setValue}
							watch={watch}
							addPassenger={addPassenger}
							removePassenger={removePassenger}
						/>
						<PurchaseSummary
							register={register}
							watch={watch}
							setValue={setValue}
							errors={errors}
							hidePurchaseSummary={hidePurchaseSummary}
							isEditMode={isEditMode}
						/>
						{/* <AttachmentsSection
							images={attachments}
							setImages={setAttachments}
							onPreview={(img) => {
								setPreviewImage(img);
								setShowPreview(true);
							}}
						/>{" "} */}
					</div>{" "}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting
							? isEditMode
								? "Updating Refund..."
								: "Processing Refund..."
							: isEditMode
							? "Update"
							: "Confirm Refund Request"}
					</button>
				</form>
			</>
		);
	};
	return (
		<BookingComponent
			defaultValues={bookingData}
			onBack={onBack}
			onRefresh={onRefresh}
			type="CANCEL_FOR_REFUND"
			schema={cancelForRefundSchema}
			loadingMessage={
				bookingData
					? "Updating refund request..."
					: "Processing refund request..."
			}
			successMessage={
				bookingData
					? "Refund request updated successfully!"
					: "Refund request submitted successfully!"
			}
			errorMessage={
				bookingData
					? "Failed to update refund request"
					: "Failed to submit refund request"
			}
			isEditMode={!!bookingData}
		>
			<RefundForm />
		</BookingComponent>
	);
}

export default CancelForRefund;
