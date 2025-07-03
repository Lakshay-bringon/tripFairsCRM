import React, { useEffect, useMemo, useState, useCallback } from "react";
import AsideTable from "./AsideTable";
import { getCommentsByBidApi } from "../../api/booking/bookingApi";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { RefreshCw } from "lucide-react";

export default function Comments({ bid = "", open = false, onClose }) {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchComments = useCallback(async () => {
		if (!bid) return;

		setLoading(true);
		setError(null);
		try {
			const data = await getCommentsByBidApi(bid);
			setComments(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Failed to load comments");
			setComments([]);
		} finally {
			setLoading(false);
		}
	}, [bid]);

	const handleRefresh = useCallback(() => {
		fetchComments();
	}, [fetchComments]);

	useEffect(() => {
		if (open && bid) {
			fetchComments();
		}
	}, [open, bid, fetchComments]);

	const columns = [
		{ key: "datetime", label: "Date-Time" },

		{ key: "comment", label: "Comment" },
		{ key: "name", label: "User Name" },
	];

	// Determine what to render based on state
	let emptyMessage = "No comments found.";
	let displayData = comments;

	if (loading) {
		emptyMessage = (
			<div className="flex items-center justify-center py-4">
				<LoadingSpinner label="Loading comments..." />
			</div>
		);
		displayData = [];
	} else if (error) {
		emptyMessage = <div className="text-red-400 py-4 text-center">{error}</div>;
		displayData = [];
	}

	return (
		<AsideTable
			open={open}
			onClose={onClose}
			title="Comments"
			columns={columns}
			data={displayData}
			searchPlaceholder="Search comments..."
			emptyMessage={emptyMessage}
			pageSize={8}
			headerActions={
				<button
					onClick={handleRefresh}
					disabled={loading}
					className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600 hover:border-gray-500"
					title="Refresh comments"
				>
					<RefreshCw
						className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
					/>
					<span className="text-xs font-medium">Refresh</span>
				</button>
			}
		/>
	);
}
