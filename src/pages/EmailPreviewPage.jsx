import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
	dispatchEmailApi,
	dispatchEticketApi,
} from '../api/booking/bookingApi';
import { showPromiseToast } from '../utils/showPromiseToast';
import {
	generateEmailSubject,
	generateEmailHTML,
} from '../utils/emailGenerator';
import EmailEditor from '../components/common/EmailEditor.jsx';
import Modal from '../components/common/Modal';
import { useAuth } from '../auth/hooks/useAuth';

// Utility function to extract body content from HTML
const extractBodyContent = (htmlString) => {
	const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*)<\/body>/i);
	if (bodyMatch && bodyMatch[1]) {
		return bodyMatch[1].trim();
	}
	return htmlString;
};

// Utility function to replace body content in HTML while preserving structure
const replaceBodyContent = (originalHtml, newBodyContent) => {
	if (originalHtml.includes('<body')) {
		return originalHtml.replace(
			/<body[^>]*>[\s\S]*<\/body>/i,
			`<body>${newBodyContent}</body>`
		);
	}

	if (originalHtml.includes('<html')) {
		return originalHtml.replace(
			/<html[^>]*>([\s\S]*)<\/html>/i,
			`<html$1><body>${newBodyContent}</body></html>`
		);
	}

	return `<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${newBodyContent}</body></html>`;
};

export default function EmailPreviewPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [isSending, setIsSending] = useState(false);
	const [emailHTML, setEmailHTML] = useState('');
	const [isGenerating, setIsGenerating] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [attachments, setAttachments] = useState([]);
	const [showAttachmentInput, setShowAttachmentInput] = useState(false);
	const { user } = useAuth();

	const formData = location.state?.formData;
	const emailType = location.state?.emailType;
	const transactionType =
		location.state?.transactionType || formData.transaction_type;
	const bid = location.state?.bid;
	const providerId = location.state?.providerId;

	// Generate email HTML in useEffect
	useEffect(() => {
		if (transactionType && formData && emailType) {
			setIsGenerating(true);
			try {
				generateEmailHTML(transactionType, formData, emailType)
					.then((generatedHTML) => {
						setEmailHTML(generatedHTML);
					})
					.catch((error) => {
						// console.error("Error generating email HTML:", error);
						setEmailHTML('');
					});
			} catch (error) {
				// console.error("Error generating email HTML:", error);
				setEmailHTML('');
			} finally {
				setIsGenerating(false);
			}
		} else {
			setIsGenerating(false);
		}
	}, [transactionType, formData, emailType]);

	const handleSendEmail = async () => {
		if (!emailHTML) {
			alert('No email content to send');
			return;
		}

		if (!bid) {
			alert('Booking ID is required to send email');
			return;
		}

		if (!providerId) {
			alert('Provider ID is required to send email');
			return;
		}

		setShowConfirmationModal(true);
	};
	const confirmSendEmail = async () => {
		setShowConfirmationModal(false);
		setIsSending(true);

		// Convert HTML to base64
		const htmlContentBase64 = btoa(unescape(encodeURIComponent(emailHTML)));
		// Generate dynamic email subject
		const subject = generateEmailSubject(
			formData || {},
			transactionType,
			emailType
		); // Process attachments as base64 for e-ticket emails
		let processedAttachments = [];
		if (attachments.length > 0) {
			try {
				processedAttachments = await Promise.all(
					attachments.map(async (attachment, index) => {
						const base64 = await new Promise((resolve, reject) => {
							const reader = new FileReader();
							reader.onload = () => {
								const base64String = reader.result; // Remove data:type;base64, prefix
								resolve(base64String);
							};
							reader.onerror = reject;
							reader.readAsDataURL(attachment); // attachment is already a File object
						});

						return base64;
					})
				);
			} catch (error) {
				// console.error('Error processing attachments:', error);
				setIsSending(false);
				return;
			}
		}

		// Prepare API payload and call appropriate API based on email type
		let emailPromise;

		// For e-ticket emails, send with base64 attachments
		const eticketPayload = {
			emailType: emailType, // Include email type for clarity
			bid: bid,
			subject: subject,
			htmlContentBase64: htmlContentBase64,
			providerId: providerId,
			userId: user?.id, // Optional user ID if available
			// Send processed attachments with base64 content
			attachments: processedAttachments,
		};

		emailPromise = dispatchEticketApi(eticketPayload);

		showPromiseToast(
			emailPromise,
			{
				loading:
					emailType === 'e-ticket'
						? 'Dispatching e-ticket...'
						: 'Sending email...',
				success:
					emailType === 'e-ticket'
						? 'E-ticket dispatched successfully!'
						: 'Email sent successfully!',
				error: (err) => err.message,
			},
			{
				duration: 4000,
			}
		).finally(() => {
			setIsSending(false);
		});
	};

	const handleEditEmail = () => {
		// We just need to set isEditing to true here
		// The body extraction happens in the EmailEditor component rendering
		setIsEditing(true);
	};

	const handleSaveEditedEmail = (editedHTML) => {
		const originalHTML = emailHTML;

		const updatedHTML = replaceBodyContent(originalHTML, editedHTML);

		// Update the email HTML with the edited version - preserve original structure

		setEmailHTML(updatedHTML);
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
	};

	const handleFileSelect = (event) => {
		const files = Array.from(event.target.files);
		setAttachments((prev) => [...prev, ...files]);
		setShowAttachmentInput(false);
		// Reset the input
		event.target.value = '';
	};

	const removeAttachment = (index) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	if (isGenerating) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<div className="text-center p-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<h2 className="text-xl font-semibold text-blue-400 mb-2">
						Generating Email...
					</h2>
					<p className="text-gray-300">
						Please wait while we prepare your email content.
					</p>
				</div>
			</div>
		);
	}

	if (!emailHTML) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<div className="text-center p-8">
					<h2 className="text-xl font-semibold text-red-400 mb-4">
						No Email Content Available
					</h2>
					<p className="text-gray-300 mb-2">
						{!transactionType || !formData || !emailType
							? 'Missing required data to generate email content.'
							: 'Failed to generate email content. Please try again.'}
					</p>
					<p className="text-gray-400 text-sm mb-4">
						Required: Transaction Type, Form Data, and Email Type
					</p>
					<button
						onClick={() => window.history.back()}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
					>
						{'<- Back'}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col">
			{/* Confirmation Modal */}
			<Modal
				isOpen={showConfirmationModal}
				onClose={() => setShowConfirmationModal(false)}
				title="Confirm Email Sending"
			>
				<p className="text-gray-300">
					Have you proofread the email content? Once sent, it cannot be undone.
				</p>
				<div className="flex justify-end gap-4 mt-4">
					<button
						onClick={() => setShowConfirmationModal(false)}
						className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
					>
						Cancel
					</button>
					<button
						onClick={confirmSendEmail}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						Confirm
					</button>
				</div>
			</Modal>

			{/* Show Email Editor when in editing mode */}
			{isEditing ? (
				<EmailEditor
					initialHtml={extractBodyContent(emailHTML)}
					onSave={handleSaveEditedEmail}
					onCancel={handleCancelEdit}
					isSaving={false}
				/>
			) : (
				<>
					{' '}
					{/* Fixed header with Go Back on left, buttons on right */}
					<header className="w-full h-16 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-6">
						<div className="flex justify-start">
							<button
								onClick={() => navigate(-1)}
								className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
							>
								Go Back
							</button>
						</div>
						<div className="flex items-center gap-3">
							<input
								type="file"
								id="attachment-input"
								className="hidden"
								multiple
								accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
								onChange={handleFileSelect}
							/>
							<button
								onClick={() =>
									document.getElementById('attachment-input').click()
								}
								disabled={isGenerating}
								className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition ${
									isGenerating
										? 'bg-gray-600 text-gray-400 cursor-not-allowed'
										: ''
								}`}
								title="Add attachments"
							>
								📎 Add Attachment
							</button>

							<button
								onClick={handleEditEmail}
								disabled={isGenerating || !emailHTML}
								className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ${
									isGenerating || !emailHTML
										? 'bg-gray-600 text-gray-400 cursor-not-allowed'
										: ''
								}`}
								title={
									isGenerating
										? 'Generating email content...'
										: !emailHTML
										? 'No email content to edit'
										: 'Edit email content'
								}
							>
								{isGenerating ? 'Generating...' : 'Edit'}
							</button>
							<button
								onClick={handleSendEmail}
								disabled={
									isSending || !emailHTML || !bid || !providerId || isGenerating
								}
								className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
									isSending || !emailHTML || !bid || !providerId || isGenerating
										? 'bg-gray-600 text-gray-400 cursor-not-allowed'
										: ''
								}`}
								title={
									!bid || !providerId
										? 'Missing booking/provider info'
										: isGenerating
										? 'Generating email content...'
										: ''
								}
							>
								{isSending
									? 'Sending...'
									: isGenerating
									? 'Generating...'
									: 'Send Email'}
							</button>
						</div>{' '}
					</header>
					{/* Attachments section for e-ticket emails */}
					{attachments.length > 0 && (
						<div className="bg-gray-800 border-b border-gray-600 p-4 ">
							<h3 className="text-white font-medium mb-2">
								Attachments ({attachments.length})
							</h3>
							<div className="flex flex-wrap gap-2">
								{attachments.map((attachment, index) => (
									<div
										key={index}
										className="bg-gray-700 rounded-lg p-2 flex items-center gap-2 text-sm"
									>
										<span className="text-gray-300">{attachment.name}</span>
										<span className="text-gray-400">
											({formatFileSize(attachment.size)})
										</span>
										<button
											onClick={() => removeAttachment(index)}
											className="text-red-400 hover:text-red-300 ml-1"
											title="Remove attachment"
										>
											×
										</button>
									</div>
								))}
							</div>
						</div>
					)}
					{/* Email preview fills the rest of the space */}
					<div className="flex-1 min-h-0">
						<iframe
							title="Email Preview"
							srcDoc={emailHTML}
							sandbox="allow-same-origin allow-scripts"
							className="w-full h-full bg-white border shadow-lg rounded"
						/>
					</div>
				</>
			)}
		</div>
	);
}
