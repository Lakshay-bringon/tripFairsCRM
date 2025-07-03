import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Text,
} from "@react-email/components";

export const EmailCardDecline = (props) => {
	const {
		agent_name = "",
		created_by = "",
		amount = "XXX.XX",
		currency = "USD",
	} = props;

	const agentName = agent_name || created_by || "Agent";

	return (
		<Html>
			<Head />
			<Preview>Card Decline Notice</Preview>
			<Body style={main}>
				<Container style={container}>
					<Text style={heading}>CARD DECLINE NOTICE</Text>

					<div style={alertBox}>
						<Text style={alertText}>
							<strong style={warningText}>Attention!!</strong>
						</Text>

						<Text style={contentText}>
							Your reservation is <span style={errorText}>still pending</span>{" "}
							due to <span style={errorText}>card decline</span>.
						</Text>

						<Text style={contentText}>
							Please call your bank to approve the payment and let us know once
							done so that we can process your transaction of amount{" "}
							<span style={successText}>
								{amount} {currency}
							</span>
							.
						</Text>

						<Text style={signatureText}>
							Thanks
							<br />
							<span style={agentNameText}>{agentName}</span>
						</Text>
					</div>

					<Text style={footerText}>
						For any questions, call us at <strong>+1(855) 623-7022</strong> or
						email{" "}
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
	textAlign: "center",
	color: "#333",
};

const alertBox = {
	backgroundColor: "#fef2f2",
	border: "1px solid #fecaca",
	borderRadius: "8px",
	padding: "20px",
	marginBottom: "20px",
};

const alertText = {
	margin: "0 0 12px 0",
	lineHeight: "1.5",
};

const warningText = {
	color: "#dc2626",
};

const contentText = {
	margin: "0 0 12px 0",
	lineHeight: "1.5",
	color: "#374151",
};

const errorText = {
	color: "#dc2626",
	fontWeight: "600",
};

const successText = {
	color: "#059669",
	fontWeight: "600",
};

const signatureText = {
	margin: "0",
	lineHeight: "1.5",
	color: "#374151",
};

const agentNameText = {
	color: "#2563eb",
	fontWeight: "600",
};

const footerText = {
	textAlign: "center",
	fontSize: "14px",
	color: "#6b7280",
	marginTop: "20px",
};

const linkStyle = {
	color: "#2563eb",
	textDecoration: "none",
};

export default EmailCardDecline;
