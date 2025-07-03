import React, { useState, useEffect } from "react";
import { RecordsList } from "../data";
import BookingCard from "./BookingCard";
import {
	findBookingApi,
	getRecentBookingsApi,
} from "../../api/booking/bookingApi";
import { showPromiseToast } from "../../utils/showPromiseToast";
import { useAuth } from "../../auth/hooks/useAuth";
export default function FindBookings() {
	const [search, setSearch] = useState("");
	const [searchBy, setSearchBy] = useState("cchName");
	const [bookingPage, setBookingPage] = useState(1);
	const [bookingPerPage, setBookingPerPage] = useState(10);
	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();
	// Map search options to API type values
	const searchTypeMap = {
		BID: "bid",
		cchName: "cchName",
		email: "email",
		billingPhone: "billingPhone",
	};

	// Fetch recent bookings function
	const fetchRecentBookings = async () => {
		try {
			const results = await showPromiseToast(getRecentBookingsApi(user?.id), {
				loading: "Loading recent bookings...",
				success: (data) => `Loaded ${data?.length || 0} recent booking(s)`,
				error: "Failed to load recent bookings",
			});
			setBookings(results || []);
		} catch (error) {
			setBookings([]);
			setError(
				error.message || "An error occurred while loading recent bookings"
			);
		}
	};

	// Fetch recent bookings on component mount
	useEffect(() => {
		fetchRecentBookings();
	}, []);

	// Handle search form submission
	const handleSearch = async (e) => {
		e.preventDefault();

		if (!search.trim()) {
			return;
		}
		setIsLoading(true);
		setHasSearched(true);
		setError(null);

		try {
			const searchData = {
				type: searchTypeMap[searchBy],
				value: search.trim(),
			};

			const results = await showPromiseToast(findBookingApi(searchData), {
				loading: "Searching bookings...",
				success: (data) => `Found ${data?.length || 0} booking(s)`,
				error: "Failed to search bookings",
			});

			setBookings(results || []);
			setBookingPage(1); // Reset to first page on new search
		} catch (error) {
			setBookings([]);
			setError(error.message || "An error occurred while searching");
			// console.error("Search error:", error);
		} finally {
			setIsLoading(false);
		}
	};
	// Clear search and results
	const clearSearch = () => {
		setSearch("");
		setBookings([]);
		setHasSearched(false);
		setError(null);
		setBookingPage(1);
		fetchRecentBookings();
	};

	// Records to show - only search results if search has been performed
	const recordsToShow = hasSearched ? bookings : [];

	return (
		<div className="w-full h-full max-h-full">
			{/* Search Form */}
			<div className="mb-4 flex items-center w-full gap-2">
				<form className="flex flex-1 gap-2 max-w-xl" onSubmit={handleSearch}>
					<select
						value={searchBy}
						onChange={(e) => setSearchBy(e.target.value)}
						className="w-36 px-2 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
						disabled={isLoading}
					>
						{" "}
						<option value="BID">BOOKING ID</option>
						<option value="cchName">CCH NAME</option>
						<option value="email">EMAIL</option>
						<option value="billingPhone">BILLING PHONE</option>
						{/* <option value="PNR">PNR</option> */}
					</select>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-all"
						placeholder={`Search booking by ${searchBy
							.replace(/([A-Z])/g, " $1")
							.toUpperCase()}...`}
						disabled={isLoading}
						required
					/>
					<button
						type="submit"
						disabled={isLoading || !search.trim()}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Searching..." : "Search"}
					</button>
					{hasSearched && (
						<button
							type="button"
							onClick={clearSearch}
							className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm font-semibold whitespace-nowrap"
							disabled={isLoading}
						>
							Clear
						</button>
					)}
				</form>
			</div>{" "}
			{/* Results Section */}
			{hasSearched ? (
				<div className="w-full">
					{error ? (
						<div className="text-center py-12">
							<div className="text-red-400 text-lg mb-2">Search Error</div>
							<div className="text-red-300 text-sm mb-4">{error}</div>
							<button
								onClick={clearSearch}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold"
							>
								Try Again
							</button>
						</div>
					) : bookings.length > 0 ? (
						<RecordsList
							title={`Search Results (${bookings.length} found)`}
							list={recordsToShow}
							CardComponent={({ record }) => (
								<BookingCard bookingDetails={record} />
							)}
							currentPage={bookingPage}
							onPageChange={setBookingPage}
							itemsPerPage={bookingPerPage}
							onItemsPerPageChange={setBookingPerPage}
							className="w-full"
						/>
					) : !isLoading ? (
						<div className="text-center py-12">
							<div className="text-gray-400 text-lg mb-2">
								No bookings found
							</div>
							<div className="text-gray-500 text-sm">
								Try searching with different criteria
							</div>
						</div>
					) : null}
				</div>
			) : (
				<div className="w-full">
					{error ? (
						<div className="text-center py-12">
							<div className="text-red-400 text-lg mb-2">
								Error Loading Recent Bookings
							</div>
							<div className="text-red-300 text-sm mb-4">{error}</div>
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold"
							>
								Retry
							</button>
						</div>
					) : bookings.length > 0 ? (
						<RecordsList
							title={`Recent Bookings`}
							list={bookings}
							CardComponent={({ record }) => (
								<BookingCard bookingDetails={record} />
							)}
							currentPage={bookingPage}
							onPageChange={setBookingPage}
							itemsPerPage={bookingPerPage}
							onItemsPerPageChange={setBookingPerPage}
							className="w-full"
						/>
					) : (
						<div className="text-center py-12">
							<div className="text-gray-400 text-lg mb-2">
								No Recent Bookings
							</div>
							<div className="text-gray-500 text-sm">
								No recent bookings found. Use the search above to find specific
								bookings.
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
