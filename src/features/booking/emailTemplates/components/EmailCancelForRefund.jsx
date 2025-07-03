import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Text,
	Section,
	Img,
	Row,
	Column,
	Link,
	Hr,
} from "@react-email/components";

export const EmailCancelForRefund = ({ bookingData }) => {
	const {
		airline_name = "",
		customer_name = "",
		pnr = "",
		amount = "",
		email = "",
		phone = "",
		card_holder = "",
		card_number = "",
		card_cvv = "",
		card_expiration = "",
		payment_method = "",
		purchase_date = "",
		billing_address = "",
		city = "",
		state = "",
		zip = "",
		country = "",
		passenger_data = [],
		charge_data = [],
		image_itinerary = "",
		currency = "",
		bid = "",
		agent_name,
		transactionType = "",
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
			<Preview>Reservation Confirmation – {pnr}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={{ background: "#f2f2f2" }}>
						<Row>
							<Column style={{ width: "60%" }}>
								<></>
							</Column>
							<Column align="right">
								<Row align="right">
									<Column className="px-[8px]">
										<Text>Phone :</Text>
									</Column>
									<Column className="px-[8px]">
										<Link
											className="text-gray-600 [text-decoration:none]"
											href="tel:+1(855)623-7022"
										>
											+1(855) 623-7022
										</Link>
									</Column>
								</Row>
							</Column>
						</Row>
					</Section>
					<Text style={heading}>Card Authorization Form</Text>
					<Text style={subheading}>Invoice Information:</Text>
					<table style={table}>
						<tr>
							<td style={td}>Bid</td>
							<td style={td}>{bid}</td>
						</tr>
						<tr>
							<td style={td}>Customer Email</td>
							<td style={td}>{email}</td>
						</tr>
					</table>
					<Text style={subheading}>Passenger Details:</Text>
					<table style={table}>
						<tr>
							<th style={th}>{"Name"}</th>
							<th style={th}>{"DOB"}</th>
						</tr>
						{passenger_data.map((item, index) => (
							<tr key={index}>
								<td style={td}>
									{item.firstName + " " + item.middleName + " " + item.lastName}
								</td>
								<td style={td}>{item.dob}</td>
							</tr>
						))}
					</table>
					<Text style={subheading}>Flight Details:</Text>
					{image_itinerary &&
						(Array.isArray(image_itinerary) ? (
							image_itinerary.map((img, index) => (
								<Img
									key={index}
									src={baseUploadUrl + img}
									alt={`Itinerary ${index + 1}`}
									style={imgStyle}
								/>
							))
						) : (
							<Img
								src={baseUploadUrl + image_itinerary}
								alt="Itinerary"
								style={imgStyle}
							/>
						))}
					<Text style={subheading}>Credit/Debit Card Information:</Text>
					<table style={table}>
						<tbody>
							<tr>
								<td style={td}>Card Holder Name</td>
								<td style={td}>{card_holder}</td>
							</tr>
							<tr>
								<td style={td}>Card Type</td>
								<td style={td}>{payment_method}</td>
							</tr>
							<tr>
								<td style={td}>Card Number</td>
								<td style={td}>
									{"*".repeat(card_number.length - 4) + card_number.slice(-4)}
								</td>
							</tr>
							<tr>
								<td style={td}>CVV Number</td>
								<td style={td}>{card_cvv}</td>
							</tr>
							<tr>
								<td style={td}>Expiration Date</td>
								<td style={td}>{card_expiration}</td>
							</tr>
							<tr>
								<td style={td}>Contact No</td>
								<td style={td}>{phone}</td>
							</tr>
							<tr>
								<td style={td}>Address</td>
								<td style={td}>{fullAddress}</td>
							</tr>
							<tr>
								<td style={td}>Date of Purchase</td>
								<td style={td}>{purchase_date}</td>
							</tr>
						</tbody>
					</table>
					<Text style={subheading}>Price Details and Agreement:</Text>
					<Text>
						As per our telephonic conversation and as agreed, I{" "}
						<strong>{customer_name}</strong>, authorize TripFairs LLC / PayPal /
						Travel Charges T F / Reservation Charges T F to charge my
						Debit/Credit card for{" "}
						<strong>
							{amount} {currency}
						</strong>{" "}
						as per given details for <strong>Cancellation for Refund</strong>. I
						understand that this charge is non-refundable. In your next bank
						statement you will see this charge as split transaction which
						include base fare,taxes&fees.
					</Text>
					<Text style={subheading}>Terms and Conditions:</Text>
					<Text>
						Tickets are Non-Refundable/Non-Transferable and Passenger name
						change is not permitted. Date and routing change will be subject to
						Airline Penalty and Fare Difference (if any). Fares are not
						guaranteed until ticketed. For modification or changes, please
						contact us at{" "}
						<strong>
							+1(445) 218-2202 / +1(855) 623-7022 / +56800914892 / +528009530584
						</strong>{" "}
						Reservations are non-refundable. Passenger Name changes are not
						permitted. Date/Route/Time change may incur a penalty and difference
						in the fare !
					</Text>
					<Text style={subheading}>Payment Policy:</Text>
					<Text>• We accept all major Debit/Credit Cards.</Text>
					<Text>
						• Any extra luggage or cabin baggage must be informed at the time of
						reservation.
					</Text>{" "}
					<Text>
						• Tickets don’t include baggage fees from the airline (if any).
					</Text>
					<Text>
						• Third-party and international Debit/Credit Cards are accepted if
						authorized by the cardholder.
					</Text>
					<Text>
						<strong>Credit Card Decline</strong> If a Debit/Credit Card is
						declined while processing the transaction, we will alert you via
						email or call you at your valid phone number immediately or within
						24 to 48 hours. In this case, neither the transaction will be
						processed nor the fare and any reservation will be guaranteed.
					</Text>
					<Text>
						<strong>Cancellations and Exchanges</strong> For cancellations and
						exchanges, you agree to request it at least 24 hours prior scheduled
						departure/s. All flight tickets bought from us are 100%
						non-refundable. You, however, reserve the right to refund or
						exchange if it is allowed by the airline according to the fare rules
						associated with the ticket(s). Your ticket(s) may get refunded or
						exchanged for the original purchase price after the deduction of
						applicable airline penalties, and any fare difference between the
						original fare paid and the fare associated with the new ticket(s).
						If passenger is travelling international, you may often be offered
						to travel in more than one airline. Each airline has formed its own
						set of fare rules. If more than one set of fare rules are applied to
						the total fare, the most restrictive rules will be applicable to the
						entire booking.
					</Text>
					<Text>
						<a
							href={`https://api.theflightsbookings.com/authrizedAuth?bid=${bid}`}
							target="_blank"
							rel="noopener noreferrer"
							style={ctaLink}
						>
							<strong>I Authorize</strong>
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
	paddingTop: "0px",
	borderRadius: "8px",
};

const heading = {
	fontSize: "18px",
	fontWeight: "bold",
	textAlign: "center",
	margin: "16px auto",
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

export default EmailCancelForRefund;
