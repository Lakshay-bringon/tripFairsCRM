// Number formatter for quantities
export const numberFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

// Percentage formatter
export const percentFormatter = new Intl.NumberFormat("en-US", {
	style: "percent",
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});

// Compact number formatter (e.g., 1.2K, 1.2M)
export const compactNumberFormatter = new Intl.NumberFormat("en-US", {
	notation: "compact",
	compactDisplay: "short",
});

// =============================================================================
// CENTRALIZED EST DATE UTILITIES
// =============================================================================
// All date operations should use these functions to ensure consistent EST timezone

/**
 * Get the current date and time in EST timezone
 * @returns {Date} Current date in EST
 */
export const getCurrentESTDate = () => {
	// Use proper timezone conversion that handles DST automatically
	const now = new Date();
	const estFormatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	const parts = estFormatter.formatToParts(now);
	const year = parseInt(parts.find((part) => part.type === "year").value);
	const month = parseInt(parts.find((part) => part.type === "month").value);
	const day = parseInt(parts.find((part) => part.type === "day").value);

	// Create a new date with EST date components at noon to avoid timezone issues
	return new Date(year, month - 1, day, 12, 0, 0, 0);
};

/**
 * Convert any date to EST timezone
 * @param {Date|string} date - Date to convert
 * @returns {Date} Date converted to EST
 */
export const convertToEST = (date) => {
	if (!date) return null;
	const inputDate = new Date(date);
	if (isNaN(inputDate.getTime())) return null;

	// Use proper timezone conversion that handles DST automatically
	const estFormatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	const parts = estFormatter.formatToParts(inputDate);
	const year = parseInt(parts.find((part) => part.type === "year").value);
	const month = parseInt(parts.find((part) => part.type === "month").value);
	const day = parseInt(parts.find((part) => part.type === "day").value);

	// Create a new date with EST date components at noon to avoid timezone issues
	return new Date(year, month - 1, day, 12, 0, 0, 0);
};

/**
 * Format date for display purposes (MM/DD/YYYY format in EST)
 * @param {Date|string} date - Date to format
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} Formatted date string
 */
export const formatESTDate = (date, fallback = "N/A") => {
	const estDate = date ? convertToEST(date) : getCurrentESTDate();
	if (!estDate) return fallback;

	return estDate.toLocaleDateString("en-US", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

/**
 * Format date and time for display purposes (MM/DD/YYYY HH:MM AM/PM format in EST)
 * @param {Date|string} date - Date to format
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} Formatted date and time string
 */
export const formatESTDateTime = (date, fallback = "N/A") => {
	const estDate = date ? convertToEST(date) : getCurrentESTDate();
	if (!estDate) return fallback;

	return estDate.toLocaleString("en-US", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

/**
 * Format date for ISO string with EST timezone (for API calls)
 * @param {Date|string} date - Date to format
 * @returns {string} ISO string in EST timezone
 */
export const formatESTISOString = (date) => {
	const estDate = date ? convertToEST(date) : getCurrentESTDate();
	if (!estDate) return null;

	// Get the EST date components
	const year = estDate.getFullYear();
	const month = String(estDate.getMonth() + 1).padStart(2, "0");
	const day = String(estDate.getDate()).padStart(2, "0");
	const hours = String(estDate.getHours()).padStart(2, "0");
	const minutes = String(estDate.getMinutes()).padStart(2, "0");
	const seconds = String(estDate.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-05:00`;
};

/**
 * Format date for input fields (YYYY-MM-DD format in EST)
 * @param {Date|string} date - Date to format
 * @returns {string} Date string for input fields
 */
export const formatESTDateForInput = (date) => {
	const estDate = date ? convertToEST(date) : getCurrentESTDate();
	if (!estDate) return "";

	const year = estDate.getFullYear();
	const month = String(estDate.getMonth() + 1).padStart(2, "0");
	const day = String(estDate.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

/**
 * Get EST date for email templates and purchase dates
 * @param {Date|string} date - Optional date, defaults to current EST date
 * @returns {string} Formatted date for email templates
 */
export const getESTDateForEmails = (date) => {
	return formatESTDate(date);
};

/**
 * Get EST timestamp for database operations
 * @param {Date|string} date - Optional date, defaults to current EST date
 * @returns {string} ISO timestamp in EST
 */
export const getESTTimestamp = (date) => {
	return formatESTISOString(date);
};

// =============================================================================
// LEGACY DATE FORMATTERS (Updated to use EST)
// =============================================================================

// Date formatter (updated to use EST)
export const dateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
	timeZone: "America/New_York",
});

// Time formatter (updated to use EST)
export const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
	timeZone: "America/New_York",
});

// Safe date formatter that handles invalid dates (updated to use EST)
export function formatSafeDate(dateValue, fallback = "N/A") {
	if (!dateValue) return fallback;
	return formatESTDate(dateValue, fallback);
}

// Local date string formatter (YYYY-MM-DD) in EST timezone
export function formatLocalDateString(dateValue) {
	if (!dateValue) return "";
	return formatESTDateForInput(dateValue);
}
