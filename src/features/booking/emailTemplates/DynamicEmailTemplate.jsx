import React from "react";
import PropTypes from "prop-types";
// import { renderToStaticMarkup } from "react-dom/server";
import { render } from "@react-email/components";
import EmailUpgrade from "./components/EmailUpgrade";
import EmailExchange from "./components/EmailExchange";
import EmailSeatAssignment from "./components/EmailSeatAssignment";
import EmailCancelForRefund from "./components/EmailCancelForRefund";
import EmailCancelForFutureCredit from "./components/EmailCancelForFutureCredit";
import EmailCardDecline from "./components/EmailCardDecline";
import ETicket from "./components/ETicket";
import { TRANSACTION_TYPES } from "../../../constants";
import ReservationConfirmation from "./components/ReservationConfirmation";

const DynamicEmailTemplate = ({ transactionType, formData, emailType }) => {
	const renderTemplate = () => {
		if (emailType === "declined") {
			return <EmailCardDecline {...formData} />;
		} else if (emailType === "e-ticket") {
			return <ETicket bookingData={formData} />;
		} else {
			switch (transactionType) {
				case TRANSACTION_TYPES.NEW_BOOKING:
					return (
						<ReservationConfirmation
							bookingData={{ ...formData, transactionType }}
						/>
					);
				case TRANSACTION_TYPES.UPGRADE:
					return (
						<EmailUpgrade bookingData={{ ...formData, transactionType }} />
					);
				case TRANSACTION_TYPES.EXCHANGE:
					return (
						<EmailExchange bookingData={{ ...formData, transactionType }} />
					);
				case TRANSACTION_TYPES.SEAT_ASSIGNMENT:
					return (
						<EmailSeatAssignment
							bookingData={{ ...formData, transactionType }}
						/>
					);
				case TRANSACTION_TYPES.CANCEL_FOR_REFUND:
					return (
						<EmailCancelForRefund
							bookingData={{ ...formData, transactionType }}
						/>
					);
				case TRANSACTION_TYPES.CANCEL_FOR_FUTURE_CREDIT:
					return (
						<EmailCancelForFutureCredit
							bookingData={{ ...formData, transactionType }}
						/>
					);
				default:
					return <p>Invalid transaction type</p>;
			}
		}
	};

	return <div>{renderTemplate()}</div>;
};

DynamicEmailTemplate.propTypes = {
	transactionType: PropTypes.string.isRequired,
	formData: PropTypes.object.isRequired,
};

export const generateEmailHTML = async (transaction_type, formData) => {
	return await render(
		<DynamicEmailTemplate
			transactionType={transaction_type}
			formData={formData}
		/>
	);
};

export default DynamicEmailTemplate;
