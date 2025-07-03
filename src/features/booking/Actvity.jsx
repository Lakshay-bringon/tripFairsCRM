import React, { useEffect, useState, useCallback } from "react";
import AsideTable from "./AsideTable";
import { getActivityByBidApi } from "../../api/booking/bookingApi";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { RefreshCw } from "lucide-react";

const columns = [
	{ key: "datetime", label: "Date-Time" },
	{ key: "activity", label: "Activity" },
	{ key: "name", label: "Done by" },
];

export default function Activity({ bid = "", open = false, onClose }) {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchActivities = useCallback(async () => {
		if (!bid) return;

		setLoading(true);
		setError(null);
		try {
			const data = await getActivityByBidApi(bid);
			setActivities(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Failed to load activities");
			setActivities([]);
		} finally {
			setLoading(false);
		}
	}, [bid]);

	const handleRefresh = useCallback(() => {
		fetchActivities();
	}, [fetchActivities]);

	useEffect(() => {
		if (open && bid) {
			fetchActivities();
		}
	}, [open, bid, fetchActivities]);
	// Determine what to render based on state
	let emptyMessage = "No activities found.";
	let displayData = activities;

	if (loading) {
		emptyMessage = (
			<div className="flex items-center justify-center py-4">
				<LoadingSpinner label="Loading activities..." />
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
			title="Activity"
			columns={columns}
			data={displayData}
			searchPlaceholder="Search activities..."
			emptyMessage={emptyMessage}
			pageSize={8}
			headerActions={
				<button
					onClick={handleRefresh}
					disabled={loading}
					className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600 hover:border-gray-500"
					title="Refresh activities"
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
