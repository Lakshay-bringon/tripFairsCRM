import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Text,
	Section,
	Img,
} from "@react-email/components";

export const ETicket = ({ bookingData }) => {
	const {
		airline_name = "UNITED AIRLINES",
		customer_name = "",
		pnr = "",
		total_cost = "",
		currency = "USD",
		email = "",
		phone = "",
		card_holder = "",
		payment_method = "",
		purchase_date = "",
		billing_address = "",
		city = "",
		state = "",
		zip = "",
		country = "US",
		passenger_data = [],
		itinerary_details = "",
		bid = "",
		agent_name = "",
	} = bookingData;

	const fullAddress = [billing_address, city, state, zip, country]
		.filter(Boolean)
		.join(", ");

	const baseUploadUrl =
		import.meta.env.VITE_UPLOADS_BASE_URL ||
		"https://api.theflightsbookings.com/uploads/";

	return (
		<Html>
			<Head />
			<Preview>E-Ticket Confirmation – {pnr}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Text style={heading}>
						{airline_name} – E-TICKET CONFIRMATION – {pnr}
					</Text>
					<Text>
						Dear <strong>{customer_name}</strong>,
					</Text>
					<Text>
						Thank you for choosing <strong>{airline_name}</strong>. I've
						attached your e-tickets to this email for your upcoming journey.
					</Text>
					<Text>
						The total cost to change this itinerary including all taxes and fees
						would be:{" "}
						<strong>
							{currency} {total_cost || "165.30"}
						</strong>
					</Text>

					<Text style={subheading}>Travel Details:</Text>
					<table style={table}>
						<tbody>
							<tr>
								<th style={th}>S. No.</th>
								<th style={th}>Type</th>
								<th style={th}>First Name</th>
								<th style={th}>Last Name</th>
							</tr>
							{passenger_data && passenger_data.length > 0
								? passenger_data.map((passenger, index) => (
										<tr key={index}>
											<td style={td}>{index + 1}</td>
											<td style={td}>{passenger.type}</td>
											<td style={td}>{passenger.firstName}</td>
											<td style={td}>{passenger.lastName}</td>
										</tr>
								  ))
								: null}
						</tbody>
					</table>

					<Text style={subheading}>Important Notes:</Text>
					<ol style={listStyle}>
						<li style={listItem}>
							Please bring a valid Real ID in case of a{" "}
							<strong>Domestic Departure</strong> and your passport, which
							should be valid for at least 6 months from the date of travel in
							case of an International Departure, along with your e-ticket for
							check-in.
						</li>
						<li style={listItem}>
							Passenger names must be the same as appear on the passport in case
							of International Departure) OR any{" "}
							<strong>Real ID for Domestic Departure</strong>.
						</li>
						<li style={listItem}>
							Please review departure/arrival dates, times, origin/destination
							cities, stopovers, and connections.
						</li>
						<li style={listItem}>
							We advise all passengers to ensure to have all travel documents
							including Passports, and required visas issued{" "}
							<strong>(If Required)</strong> and presented at the time of
							travel.
						</li>
						<li style={listItem}>
							Please arrive at the airport at least <strong>2 hours</strong>{" "}
							prior to your flight in case of a Domestic Departure and at least{" "}
							<strong>3 hours</strong> before departure in case of an
							International Departure.
						</li>
						<li style={listItem}>
							For any changes or assistance, contact us at{" "}
							<strong>+1(855) 623-7022</strong>
						</li>
					</ol>

					<Text>
						Your attached e-ticket contains all the necessary details, including
						seat information and check-in instructions.
					</Text>

					<Text>
						We value your business and look forward to serving your travel needs
						in the near future.
					</Text>

					<Text>Thank you, and we wish you a pleasant journey!</Text>

					<Text>Best regards,</Text>

					<Text style={footerText}>
						Still, have questions? Call us at <strong>+1(855) 623-7022</strong>.
						Our agents are available 24 hours a day, 7 days a week to assist
						you. You can also email us at{" "}
						<a href="mailto:support@theflightsbookings.com">
							support@theflightsbookings.com
						</a>
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

const main = {
	fontFamily: "Arial, sans-serif",
	backgroundColor: "#f9f9f9",
	margin: 0,
	padding: 0,
};

const container = {
	maxWidth: "600px",
	margin: "0 auto",
	backgroundColor: "#ffffff",
	padding: "24px",
	borderRadius: "8px",
};

const heading = {
	fontSize: "18px",
	fontWeight: "bold",
	marginBottom: "16px",
};

const subheading = {
	fontWeight: "bold",
	marginTop: "20px",
	marginBottom: "8px",
};

const table = {
	width: "100%",
	borderCollapse: "collapse",
	marginBottom: "12px",
};

const td = {
	border: "1px solid #ccc",
	padding: "8px",
	fontSize: "14px",
	verticalAlign: "top",
};

const th = {
	border: "1px solid #ccc",
	padding: "8px",
	fontSize: "14px",
	fontWeight: "bold",
	backgroundColor: "#f2f2f2",
	textAlign: "left",
};

const listStyle = {
	paddingLeft: "20px",
	marginTop: "10px",
	marginBottom: "16px",
};

const listItem = {
	marginBottom: "8px",
	lineHeight: "1.5",
};

const imgStyle = {
	width: "100%",
	height: "auto",
	marginTop: "8px",
	marginBottom: "16px",
};

const ctaLink = {
	display: "inline-block",
	padding: "8px 12px",
	backgroundColor: "#007BFF",
	color: "#fff",
	textDecoration: "none",
	borderRadius: "4px",
	fontWeight: "bold",
	marginLeft: "6px",
};

const footerText = {
	fontSize: "14px",
	color: "#666",
	marginTop: "20px",
};

export default ETicket;
