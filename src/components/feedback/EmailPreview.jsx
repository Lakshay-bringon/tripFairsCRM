import React, { useState } from "react";
import { Modal } from "../common";
import { Button } from "../ui";

/**
 * EmailPreview - renders a preview of an email with a Send Email button.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The email content/component to preview.
 */
export default function EmailPreview({ children }) {
	const [showConfirm, setShowConfirm] = useState(false);

	return (
		<>
			<Button
				className="!bg-blue-600 hover:!bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all fixed top-6 right-8 z-50"
				onClick={() => setShowConfirm(true)}
			>
				Send Email
			</Button>
			<div className="w-full">{children}</div>
			<Modal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				title="Are you sure you want to send this email?"
			>
				<div className="flex flex-col items-center gap-6 p-6 text-center">
					<div className="text-base font-semibold text-red-600 dark:text-red-400 mb-3 max-w-xl">
						Please review the content carefully before sending. This action
						cannot be undone.
					</div>
					<div className="flex gap-4 justify-center text-white font-semibold w-full mt-2">
						<Button
							variant="primary"
							className="bg-red-600 px-6 py-2"
							onClick={() => setShowConfirm(false)}
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							className="!bg-blue-600 hover:!bg-blue-700 px-6 py-2"
							onClick={() => {
								setShowConfirm(false); /* handle send email here */
							}}
						>
							Reviewed, Send Email
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
