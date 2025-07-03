import React from "react";
import BookingComponent from "./BookingComponent.jsx";
import ChargesDescription from "./ChargesDescription.jsx";
import ItineraryDetailsInput from "./ItineraryDetailsInput.jsx";
import PurchaseSummary from "./PurchaseSummary.jsx";
import AttachmentsSection from "./AttachmentsSection.jsx";
import AuthorizeSection from "./AuthorizeSection.jsx";
import PassengerDetails from "./PassengerDetails.jsx";
import { bookingSchema } from "../schemas/bookingSchema.js";

function NewBooking({ bookingData, onBack, onRefresh }) {
	// The actual form content for NewBooking
	const NewBookingForm = ({
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
		// Watch values for dynamic updates
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
						RESERVATION CONFIRMATION –
						<input
							{...register("pnr")}
							className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-32 font-bold text-white ml-2"
							style={{ minWidth: 60 }}
							value={pnr}
							onChange={(e) => setValue("pnr", e.target.value)}
							placeholder="PNR"
						/>
					</h2>
					{!isEditMode && (
						<button
							type="button"
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
								As per our conversation and as agreed, we have booked your
								reservation under Confirmation number
								<input
									{...register("pnr")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 60 }}
									value={pnr}
									onChange={(e) => setValue("pnr", e.target.value)}
									placeholder="PNR"
								/>
								on{" "}
								<input
									{...register("airline_name")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 60, textTransform: "uppercase" }}
									placeholder="Airline Name"
									value={airline}
									onChange={(e) => setValue("airline_name", e.target.value)}
								/>{" "}
								with a charge of
								<input
									{...register("amount")}
									className="bg-transparent border-0 border-b border-dashed border-gray-400 focus:border-blue-400 outline-none px-1 w-auto inline-block align-middle mx-1 text-white placeholder-gray-400"
									style={{ minWidth: 40 }}
									placeholder="Amount"
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
								(Including all taxes and fees) as per the below description.
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
						{/* Itinerary Details Section */}{" "}
						<ItineraryDetailsInput
							register={register}
							setValue={setValue}
							images={itineraryImages}
							trigger={trigger}
							setImages={setItineraryImages}
							onImageClick={(imageUrl) => {
								setPreviewImage(imageUrl);
								setShowPreview(true);
							}}
						/>{" "}
						{/* Passenger Details Section */}
						<PassengerDetails
							passengers={passengers}
							register={register}
							setValue={setValue}
							watch={watch}
							addPassenger={addPassenger}
							removePassenger={removePassenger}
						/>
						{/* Purchase Summary Section */}
						<PurchaseSummary
							register={register}
							watch={watch}
							setValue={setValue}
							errors={errors}
							hidePurchaseSummary={hidePurchaseSummary}
							isEditMode={isEditMode}
						/>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting
							? isEditMode
								? "Updating Booking..."
								: "Creating Booking..."
							: isEditMode
							? "Update"
							: "Create new Booking"}
					</button>
				</form>
			</>
		);
	};
	return (
		<BookingComponent
			defaultValues={bookingData}
			onBack={onBack}
			onRefresh={onRefresh} // Pass refresh function to BookingComponent
			type="NEW BOOKING"
			schema={bookingSchema}
			loadingMessage={
				bookingData ? "Updating booking..." : "Creating booking..."
			}
			successMessage={
				bookingData
					? "Booking updated successfully!"
					: "Booking created successfully!"
			}
			errorMessage={
				bookingData ? "Failed to update booking" : "Failed to create booking"
			}
			isEditMode={!!bookingData}
		>
			<NewBookingForm />
		</BookingComponent>
	);
}

export default NewBooking;
