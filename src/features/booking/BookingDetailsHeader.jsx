import {
	RefreshCcw,
	Activity as ActivityIcon,
	MessageSquareText,
	Mails,
	X,
	ChevronDown,
	Edit,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "../../components/ui";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "../../components/common";
import Comments from "./Comments";
import Activity from "./Actvity";

import { addCommentApi } from "../../api/booking/bookingApi";
import { useAuth } from "../../auth/hooks/useAuth";
import { showPromiseToast } from "../../utils/showPromiseToast";

export default function BookingDetailsHeader({
	isEditing = false,
	formData,
	onRefresh,
	providerId,
	bid_status,
}) {
	const [showComments, setShowComments] = useState(false);
	const [showActivity, setShowActivity] = useState(false);
	const [showCloseModal, setShowCloseModal] = useState(false);
	const [closeComment, setCloseComment] = useState("");
	const [commentError, setCommentError] = useState(false);
	const textareaRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();

	useEffect(() => {
		if (showCloseModal && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [showCloseModal]);

	// Smart navigation logic based on current route
	const getNavigationPath = () => {
		const currentPath = location.pathname;

		// If we're on a revenue route, go back to revenue/details
		if (currentPath.includes("/revenue/details/")) {
			return "/revenue/details";
		}

		// Default to find-bookings for booking routes
		return "/find-bookings";
	};
	const handleEmailAction = (emailType) => {
		navigate(`/email-preview`, {
			state: {
				emailType,
				bid: formData.bid,
				providerId: providerId,
				formData: formData,
			},
		});
	};
	const handleSaveCommentAndClose = async () => {
		if (!closeComment.trim()) {
			setCommentError(true);
			return;
		}
		try {
			await showPromiseToast(
				addCommentApi({
					bid: formData.bid,
					comment: closeComment.trim(),
					userId: user?.id,
				}),
				{
					loading: "Saving comment...",
					success: "Comment added and booking closed!",
					error: "Failed to add comment. Please try again.",
				}
			);
			setShowCloseModal(false);
			setCloseComment("");
			setCommentError(false);

			// Smart navigation based on current route
			const navigationPath = getNavigationPath();
			navigate(navigationPath);
		} catch (err) {
			setCommentError(true);
			// Optionally show error toast or message
		}
	};
	return (
		<div className="sticky top-0 z-10 flex items-center py-4 bg-transparent ">
			<div className="flex flex-1 gap-3">
				<Button
					variant="secondary"
					className="flex items-center gap-2 cursor-pointer"
					onClick={() => setShowComments(true)}
				>
					<MessageSquareText size={18} /> Comments
				</Button>
				<Button
					variant="secondary"
					className="flex items-center gap-2 cursor-pointer"
					onClick={() => setShowActivity(true)}
				>
					<ActivityIcon size={18} /> Activity
				</Button>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="secondary"
							className="flex items-center gap-2 cursor-pointer"
						>
							<Mails size={18} /> Email <ChevronDown size={16} />
						</Button>
					</PopoverTrigger>{" "}
					<PopoverContent align="start" className="w-48 p-1">
						<button
							className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 text-gray-200 transition-colors cursor-pointer"
							type="button"
							onClick={() => handleEmailAction("auth")}
						>
							Auth
						</button>

						{/* <button
							className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 text-gray-200 transition-colors cursor-pointer"
							type="button"
							onClick={() => handleEmailAction("declined")}						>
							Card Declined
						</button> */}

						{/* Only show E-Ticket button when bid_status is 3 (Ticketed & MCO Charged) */}
						{bid_status === "3" && (
							<button
								className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 text-gray-200 transition-colors cursor-pointer"
								type="button"
								onClick={() => handleEmailAction("e-ticket")}
							>
								E-Ticket
							</button>
						)}
					</PopoverContent>
				</Popover>{" "}
				<Button
					variant="secondary"
					className="flex items-center gap-2 cursor-pointer"
					title="Refresh"
					onClick={onRefresh}
				>
					<RefreshCcw size={18} /> Refresh
				</Button>{" "}
			</div>
			<div className="flex gap-2">
				<Button
					variant="destructive"
					className={`flex items-center gap-2 ${
						isEditing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
					}`}
					onClick={() => {
						!isEditing && setShowCloseModal(true);
					}}
					disabled={isEditing}
				>
					<X size={18} /> Close Booking
				</Button>{" "}
			</div>
			{/* Comments Slide-in Panel */}
			<Comments
				open={showComments}
				onClose={() => setShowComments(false)}
				bid={formData.bid}
			/>
			{/* Activity Slide-in Panel */}
			<Activity
				open={showActivity}
				onClose={() => setShowActivity(false)}
				bid={formData.bid}
			/>
			{/* Close Booking Modal */}
			<Modal
				isOpen={showCloseModal}
				onClose={() => {
					setShowCloseModal(false);
					setCloseComment("");
					setCommentError(false);
				}}
				title="Close Booking"
			>
				<div className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="close-comment"
							className="text-gray-200 font-medium"
						>
							Comment <span className="text-red-400">*</span>
						</label>
						{commentError && (
							<p className="text-red-400 text-sm mt-1">
								Please enter a comment before closing the booking
							</p>
						)}
					</div>
					<textarea
						id="close-comment"
						ref={textareaRef}
						className={`bg-gray-900 text-gray-100 rounded-lg p-4 min-h-[120px] border-2 ${
							commentError ? "border-red-500" : "border-gray-700"
						} focus:border-blue-500 resize-none w-full text-base shadow-md focus:outline-none focus:ring focus:ring-blue-500/30 transition-all`}
						value={closeComment}
						onChange={(e) => {
							setCloseComment(e.target.value);
							if (e.target.value.trim()) setCommentError(false);
						}}
						placeholder="Add a comment... (Required)"
					/>
					<Button variant="destructive" onClick={handleSaveCommentAndClose}>
						Save Comment and Close
					</Button>
				</div>
			</Modal>
		</div>
	);
}
