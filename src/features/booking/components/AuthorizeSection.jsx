function AuthorizeSection({ cardholderName, cardType, cardNumber }) {
	return (
		<div className="p-3 border border-gray-700 rounded-lg leading-loose">
			<p className="leading-loose">
				"I hereby certify that I,{" "}
				<span className="font-semibold text-white mx-1">
					{cardholderName || (
						<span className="italic text-gray-400">Cardholder Name</span>
					)}
				</span>
				, am the authorized user of the{" "}
				<span className="font-semibold text-white mx-1">
					{cardType || <span className="italic text-gray-400">Card Type</span>}
				</span>
				{""}
				bearing the number{" "}
				<span className="font-semibold text-white mx-1">
					{cardNumber || (
						<span className="italic text-gray-400">Card Number</span>
					)}
				</span>
				, and I will not dispute the payment with my credit/debit card company
				or bank. I acknowledge that this amount is being charged for my personal
				travel expenses."
			</p>
			{/* <p>
				Please confirm your acceptance of this declaration by selecting:
				<button
					type="button"
					className="inline-block align-middle px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm font-semibold ml-2"
				>
					I Agree / I Authorize
				</button>
			</p> */}
		</div>
	);
}

export default AuthorizeSection;
