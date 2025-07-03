// User Roles
export const USER_ROLES = {
	ADMIN: "admin",
	TEAM_LEADER: "leader",
	AGENT: "agent",
};

// Transaction Types
export const TRANSACTION_TYPES = {
	NEW_BOOKING: "new_booking",
	EXCHANGE: "exchange",
	SEAT_ASSIGNMENT: "seat_assignment",
	UPGRADE: "upgrade",
	CANCEL_FOR_REFUND: "cancel_for_refund",
	CANCEL_FOR_FUTURE_CREDIT: "cancel_for_future_credit",
};

// Booking Status
export const BOOKING_STATUS = [
	"Pending",
	"In-Progress",
	"Cancelled",
	"Ticketed & MCO Charged",
];
export const AUTH_STATUS = ["Pending", "Approved", "Rejected"];

export const CHARGING_STATUS = ["Pending", "Charged", "Declined"];

export const CHARGING_TYPE = ["MCO", "Airline Charge"];

export const REFUND_STATUS = ["Pending", "Approved", "Rejected"];

export const CHARGEBACK_STATUS = ["Pending", "Lost", "Won"];
//
