import { DynamicEmailTemplate } from "../features/booking/emailTemplates";
import { render } from "@react-email/render";

export const generateEmailSubject = (
	bookingData,
	transactionType,
	emailType
) => {
	const { airline_name = "", pnr = "" } = bookingData;

	// Handle special email types first
	if (emailType === "declined") {
		return "CARD DECLINE NOTICE";
	}

	// Determine the subject prefix based on transaction type
	let subjectPrefix = "RESERVATION CONFIRMATION"; // default
	switch (transactionType) {
		case "upgrade":
			subjectPrefix = "UPGRADE CONFIRMATION";
			break;
		case "exchange":
			subjectPrefix = "EXCHANGE CONFIRMATION";
			break;
		case "seat_assignment":
			subjectPrefix = "SEAT ASSIGNMENT CONFIRMATION";
			break;
		case "cancel_for_refund":
			subjectPrefix = "REFUND CONFIRMATION";
			break;
		case "cancel_for_future_credit":
			subjectPrefix = "FUTURE CREDIT CONFIRMATION";
			break;
		case "e_ticket":
			subjectPrefix = "E-TICKET CONFIRMATION";
			break;
		case "new_booking":
		default:
			subjectPrefix = "RESERVATION CONFIRMATION";
			break;
	}

	// Build the subject line with airline and PNR
	if (airline_name && pnr) {
		return `${airline_name.toUpperCase()} ${subjectPrefix} – ${pnr}`;
	} else if (pnr) {
		return `${subjectPrefix} – ${pnr}`;
	} else if (airline_name) {
		return `${airline_name.toUpperCase()} ${subjectPrefix}`;
	}

	return subjectPrefix;
};

export const generateEmailHTML = async (
	transactionType,
	formData,
	emailType
) => {
	const htmlString = await render(
		<DynamicEmailTemplate
			transactionType={transactionType}
			formData={formData}
			emailType={emailType}
		/>
	);

	// Ensure the HTML string is properly escaped for rendering
	// return `<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name="viewport" content="width=1024"></head><body>${htmlString}</body></html>`;
	return htmlString;
};
