import { Plus, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PassengerDetails({
	passengers,
	register,
	addPassenger,
	removePassenger,
	setValue,
	watch,
}) {
	const handleDateChange = (date, index) => {
		if (date instanceof Date && !isNaN(date.getTime())) {
			// Convert Date object to MM/DD/YYYY string format for validation
			const formattedDate = date.toLocaleDateString("en-US");
			setValue(`passenger_data.${index}.dob`, formattedDate);
		} else {
			setValue(`passenger_data.${index}.dob`, "");
		}
	};
	const handleManualDateInput = (event, index) => {
		const inputValue = event.target.value;

		// Always store as string for validation
		setValue(`passenger_data.${index}.dob`, inputValue);

		// Try to parse the input as a valid date for validation
		const parsedDate = new Date(inputValue);
		if (!isNaN(parsedDate.getTime()) && inputValue.length >= 8) {
			// Convert to MM/DD/YYYY format if it's a valid date
			const formattedDate = parsedDate.toLocaleDateString("en-US");
			setValue(`passenger_data.${index}.dob`, formattedDate);
		}
	};
	// Helper function to ensure we only pass valid Date objects or null to ReactDatePicker
	const getValidDateForPicker = (value) => {
		if (!value) return null;

		// If it's already a Date object, use it
		if (value instanceof Date && !isNaN(value.getTime())) {
			return value;
		}

		// If it's a string, try to parse it as a date
		if (typeof value === "string") {
			const parsedDate = new Date(value);
			if (!isNaN(parsedDate.getTime())) {
				return parsedDate;
			}
		}

		return null;
	};
	return (
		<div className="p-3 border border-gray-700 rounded-lg">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-semibold">Passenger Details</h3>
				<button
					type="button"
					onClick={addPassenger}
					className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
				>
					<Plus className="w-4 h-4" />
					Add Passenger
				</button>
			</div>
			<div className="overflow-x-auto datepicker-container">
				<table className="w-full border-separate border-spacing-y-2">
					<thead>
						<tr className="text-left border-b border-gray-700 bg-gray-800">
							<th className="pr-2 pb-2">S. No.</th>
							<th className="px-2 pb-2">Type</th>
							<th className="px-2 pb-2">First Name</th>
							<th className="px-2 pb-2">Middle Name</th>
							<th className="px-2 pb-2">Last Name</th>
							<th className="pl-2 pb-2">DOB</th>
							<th className="pl-2 pb-2"></th>
						</tr>
					</thead>
					<tbody>
						{passengers?.map((_, index) => (
							<tr
								key={index}
								className="border-b border-gray-700/50 bg-gray-900 rounded-lg shadow-sm"
							>
								<td className="py-2 px-2 font-semibold text-center">
									{index + 1}
								</td>
								<td className="py-2 px-2">
									<select
										{...register(`passenger_data.${index}.type`)}
										className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full cursor-pointer"
									>
										<option value="ADT">Adult</option>
										<option value="CHD">Child</option>
										<option value="INF">Infant</option>
									</select>
								</td>
								<td className="py-2 px-2">
									<input
										{...register(`passenger_data.${index}.firstName`)}
										className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
										placeholder="First Name"
									/>
								</td>
								<td className="py-2 px-2">
									<input
										{...register(`passenger_data.${index}.middleName`)}
										className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
										placeholder="Middle Name"
									/>
								</td>
								<td className="py-2 px-2">
									<input
										{...register(`passenger_data.${index}.lastName`)}
										className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
										placeholder="Last Name"
									/>
								</td>
								<td className="py-2 px-2">
									<div className="relative">
										<DatePicker
											name="dob"
											id="passengerDobInput"
											selected={getValidDateForPicker(
												watch(`passenger_data.${index}.dob`)
											)}
											onChange={(date) => handleDateChange(date, index)}
											onChangeRaw={(event) =>
												handleManualDateInput(event, index)
											}
											dateFormat="MM/dd/yyyy"
											placeholderText="MM/DD/YYYY"
											className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full cursor-pointer"
											showYearDropdown
											showMonthDropdown
											dropdownMode="select"
											autoComplete="off"
										/>
									</div>
								</td>
								<td className="py-2 pl-2 text-center">
									{index > 0 && (
										<button
											type="button"
											onClick={() => removePassenger(index)}
											className="text-red-400 hover:text-red-300 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* Custom styles for DatePicker visibility */}
			<style>{`
				/* Custom container to handle overflow and datepicker */
				.datepicker-container {
					position: relative;
				}
				
				/* Allow datepicker to escape overflow container */
				.datepicker-container .react-datepicker-popper {
					position: fixed !important;
					z-index: 9999 !important;
				}
				
				.react-datepicker-popper {
					z-index: 9999 !important;
				}
				.react-datepicker {
					background-color: #374151 !important;
					border: 1px solid #4b5563 !important;
					color: white !important;
					box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
						0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
				}
				.react-datepicker__header {
					background-color: #1f2937 !important;
					border-bottom: 1px solid #4b5563 !important;
				}
				.react-datepicker__current-month,
				.react-datepicker__day-name {
					color: white !important;
				}
				/* Popper triangle styling */
				.react-datepicker-popper[data-placement^="bottom"]
					.react-datepicker__triangle {
					fill: #1f2937 !important;
					color: #1f2937 !important;
				}
				.react-datepicker-popper[data-placement^="top"]
					.react-datepicker__triangle {
					fill: #374151 !important;
					color: #374151 !important;
				}
				.react-datepicker-popper[data-placement^="bottom"]
					.react-datepicker__triangle::before {
					border-bottom-color: #4b5563 !important;
				}
				.react-datepicker-popper[data-placement^="top"]
					.react-datepicker__triangle::before {
					border-top-color: #4b5563 !important;
				}
				.react-datepicker-popper[data-placement^="bottom"]
					.react-datepicker__triangle::after {
					border-bottom-color: #1f2937 !important;
				}
				.react-datepicker-popper[data-placement^="top"]
					.react-datepicker__triangle::after {
					border-top-color: #374151 !important;
				}

				.react-datepicker__day {
					color: white !important;
				}
				.react-datepicker__day:hover {
					background-color: #3b82f6 !important;
					color: white !important;
				}
				.react-datepicker__day--selected {
					background-color: #3b82f6 !important;
					color: white !important;
				}
				.react-datepicker__day--keyboard-selected {
					background-color: #1d4ed8 !important;
					color: white !important;
				}
				.react-datepicker__day--outside-month {
					color: #6b7280 !important;
				}
				.react-datepicker__year-dropdown,
				.react-datepicker__month-dropdown {
					background-color: #374151 !important;
					border: 1px solid #4b5563 !important;
					color: white !important;
				}
				.react-datepicker__year-dropdown-container--scrollable,
				.react-datepicker__month-dropdown-container--scrollable {
					background-color: #374151 !important;
				}
				.react-datepicker__year-option,
				.react-datepicker__month-option {
					background-color: #374151 !important;
					color: white !important;
				}
				.react-datepicker__month-select,
				.react-datepicker__year-select {
					background-color: #374151 !important;
					color: white !important;
				}
				.react-datepicker__year-option:hover,
				.react-datepicker__month-option:hover {
					background-color: #3b82f6 !important;
					color: white !important;
				}
				.react-datepicker__year-option--selected,
				.react-datepicker__month-option--selected {
					background-color: #3b82f6 !important;
					color: white !important;
				}
				.react-datepicker__dropdown-container {
					background-color: #374151 !important;
				}
			`}</style>
		</div>
	);
}

export default PassengerDetails;
