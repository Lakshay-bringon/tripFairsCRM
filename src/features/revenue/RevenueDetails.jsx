import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	ArrowLeft,
	Download,
	DollarSign,
	AlertTriangle,
	ChevronDown,
	ChevronUp,
	FileText,
} from 'lucide-react';
import { BOOKING_STATUS } from '../../constants';
import {
	getRevenueListApi,
	downloadReportApi,
} from '../../api/revenue/revenueApi';
import { showPromiseToast } from '../../utils/showPromiseToast';

function BookingDetailRow({ data }) {
	const navigate = useNavigate();

	const handleRowClick = () => {
		navigate(`/revenue/details/${data.bid}`);
	};

	return (
		<tr
			onClick={handleRowClick}
			className="border-b border-gray-700/50 hover:bg-gray-700/50 cursor-pointer transition-colors even:bg-gray-800/50"
		>
			<td className="w-[15%] py-3 px-4 text-white truncate border-r border-gray-700/50 text-center">
				{data.bid}
			</td>
			<td className="w-[12%] py-3 px-4 text-green-400 truncate border-r border-gray-700/50 text-center">
				{data.revenue || 0}
			</td>
			<td className="w-[12%] py-3 px-4 text-orange-400 truncate border-r border-gray-700/50 text-center">
				{data.refund || 0}
			</td>
			<td className="w-[12%] py-3 px-4 text-red-400 truncate border-r border-gray-700/50 text-center">
				{data.chargeback || 0}
			</td>
			<td className="w-[15%] py-3 px-4 text-gray-300 truncate border-r border-gray-700/50 text-center">
				{BOOKING_STATUS[data.bid_status] || '-'}
			</td>
			<td className="w-[18%] py-3 px-4 text-gray-300 truncate border-r border-gray-700/50 text-center">
				{data.datetime}
			</td>
			<td className="w-[16%] py-3 px-4 text-gray-300 truncate text-center">
				{data.agent_name || '-'}
			</td>
		</tr>
	);
}

function RevenueDetails() {
	const navigate = useNavigate();
	const location = useLocation();
	const searchParams = location.state?.searchParams || {};
	const initialResults = location.state?.results || null;

	// State for server-side data
	const [data, setData] = useState({
		records: [],
		total: 0,
		page: 1,
		limit: 10,
	});
	const [loading, setLoading] = useState(false);
	const [exportLoading, setExportLoading] = useState(false);

	// Sorting state
	const [sortBy, setSortBy] = useState('datetime');
	const [sortDir, setSortDir] = useState('desc');

	// Pagination state - default limit changed to 10
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	// Calculate total pages from server data
	const totalPages = Math.ceil(data.total / itemsPerPage);
	// Fetch data from API with server-side pagination (no sorting parameters)
	const fetchData = async (page = 1, limit = itemsPerPage) => {
		setLoading(true);
		try {
			const payload = {
				...searchParams,
				page,
				limit,
			};
			const response = await getRevenueListApi(payload);
			setData({
				records: response.records || [],
				total: response.total || 0,
				page: response.page || 1,
				limit: response.limit || limit,
				total_revenue: response.total_revenue || 0,
				total_chargeback_refund: response.total_chargeback_refund || 0,
			});
		} catch (error) {
			// console.error("Failed to fetch revenue details:", error);
			showPromiseToast(Promise.reject(error), {
				loading: 'Loading...',
				success: 'Data loaded!',
				error: 'Failed to load data',
			});
		} finally {
			setLoading(false);
		}
	}; // Initial data initialization
	useEffect(() => {
		if (initialResults) {
			// Use data passed from Revenue component
			setData({
				records: initialResults.records || [],
				total: initialResults.total || 0,
				page: initialResults.page || 1,
				limit: initialResults.limit || 10,
				total_revenue: initialResults.total_revenue || 0,
				total_chargeback_refund: initialResults.total_chargeback_refund || 0,
			});
			setCurrentPage(initialResults.page || 1);
			setItemsPerPage(initialResults.limit || 10);
		} else {
			// Fallback to API call if no data passed
			fetchData(currentPage, itemsPerPage);
		}
	}, []); // Only run on component mount

	// Local sorting function
	const sortRecords = (records, field, direction) => {
		return [...records].sort((a, b) => {
			let aVal = a[field] || '';
			let bVal = b[field] || '';

			// Handle different data types
			if (field === 'revenue' || field === 'refund' || field === 'chargeback') {
				aVal = Number(aVal) || 0;
				bVal = Number(bVal) || 0;
			} else if (field === 'datetime') {
				aVal = new Date(aVal).getTime() || 0;
				bVal = new Date(bVal).getTime() || 0;
			} else {
				aVal = String(aVal).toLowerCase();
				bVal = String(bVal).toLowerCase();
			}

			if (direction === 'asc') {
				return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
			} else {
				return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
			}
		});
	};

	// Get sorted records for display
	const sortedRecords = sortRecords(data.records, sortBy, sortDir);

	// Handle sorting (local only, no API call)
	const handleSort = (col) => {
		const newSortDir = sortBy === col && sortDir === 'asc' ? 'desc' : 'asc';
		setSortBy(col);
		setSortDir(newSortDir);
	};
	// Handle pagination (only fetch new data when page changes)
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
		fetchData(newPage, itemsPerPage);
	};

	// Handle rows per page change (fetch new data with new limit)
	const handleRowsPerPageChange = (newValue) => {
		const newLimit = Number(newValue);
		setItemsPerPage(newLimit);
		setCurrentPage(1);
		fetchData(1, newLimit);
	};
	function SortIcon({ active, dir }) {
		if (!active) return <span className="inline-block w-3" />;
		return dir === 'asc' ? (
			<ChevronUp className="inline w-3 h-3 ml-1" />
		) : (
			<ChevronDown className="inline w-3 h-3 ml-1" />
		);
	}

	// Export function using server-side API
	const handleExportData = async () => {
		setExportLoading(true);
		try {
			const exportParams = {
				userId: searchParams.userId,
				date_from: searchParams.date_from,
				date_to: searchParams.date_to,
				show_refund: searchParams.show_refund || false,
				show_chargeback: searchParams.show_chargeback || false,
				agent_id: searchParams.agent_id || null,
				provider_id: searchParams.provider_id || null,
			};

			// API handles the download directly with content disposition
			const result = await downloadReportApi(exportParams);

			showPromiseToast(Promise.resolve(), {
				loading: 'Generating report...',
				success: `Report "${result.filename}" downloaded successfully!`,
				error: 'Failed to download report',
			});
		} catch (error) {
			// console.error('Failed to export data:', error);
			showPromiseToast(Promise.reject(error), {
				loading: 'Generating report...',
				success: 'Report downloaded successfully!',
				error: 'Failed to download report',
			});
		} finally {
			setExportLoading(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto flex flex-col h-full">
			<div className="rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700 overflow-hidden flex flex-col flex-1">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-700 gap-2 bg-gray-800/80">
					<div className="flex items-center gap-3">
						<button
							onClick={() => navigate('/revenue')}
							className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-md"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h2 className="text-lg font-semibold text-white">
							Revenue Details
						</h2>
					</div>
					<button
						onClick={handleExportData}
						disabled={exportLoading}
						className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 text-sm transition-colors"
					>
						<Download className="w-4 h-4" />
						{exportLoading ? 'Generating...' : 'Export CSV'}
					</button>
				</div>
				{/* Summary Bar */}
				<div className="px-4 py-3 border-b border-gray-700 bg-gray-800/40 grid grid-cols-4 gap-4">
					<div className="flex items-center gap-2">
						<DollarSign className="w-5 h-5 text-blue-400" />
						<div>
							<div className="text-xs text-gray-400">Total Revenue</div>
							<div className="text-sm font-medium text-blue-400">
								{Number(data.total_revenue) || 0}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<FileText className="w-5 h-5 text-green-400" />
						<div>
							<div className="text-xs text-gray-400">Total Bookings</div>
							<div className="text-sm font-medium text-green-400">
								{Number(data.total) || 0}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<DollarSign className="w-5 h-5 text-purple-400" />
						<div>
							<div className="text-xs text-gray-400">Net Revenue</div>
							<div className="text-sm font-medium text-purple-400">
								{(
									(Number(data.total_revenue) || 0) * 0.95 -
									(Number(data.total_chargeback_refund) || 0)
								).toFixed(2)}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-red-400" />
						<div>
							<div className="text-xs text-gray-400">Refunds + Chargebacks</div>
							<div className="text-sm font-medium text-red-400">
								{Number(data.total_chargeback_refund) || 0}
							</div>
						</div>
					</div>
				</div>
				<div className="flex-1 p-4 flex flex-col overflow-hidden">
					{/* Details Record Table */}
					<div className="flex-1 flex flex-col overflow-hidden">
						<div className="flex-1 overflow-y-auto">
							<table className="w-full table-fixed">
								<thead className="sticky top-0 bg-gray-800 z-10">
									<tr className="text-left text-sm text-gray-400 border-b border-gray-700">
										<th className="w-[15%] pb-3 px-4 font-medium text-center border-r border-gray-700">
											Booking ID
										</th>
										<th
											className="w-[12%] pb-3 px-4 font-medium cursor-pointer select-none text-center border-r border-gray-700 hover:text-white transition-colors"
											onClick={() => handleSort('revenue')}
										>
											MCO
											<SortIcon active={sortBy === 'revenue'} dir={sortDir} />
										</th>
										<th
											className="w-[12%] pb-3 px-4 font-medium cursor-pointer select-none text-center border-r border-gray-700 hover:text-white transition-colors"
											onClick={() => handleSort('refund')}
										>
											Refund
											<SortIcon active={sortBy === 'refund'} dir={sortDir} />
										</th>
										<th
											className="w-[12%] pb-3 px-4 font-medium cursor-pointer select-none text-center border-r border-gray-700 hover:text-white transition-colors"
											onClick={() => handleSort('chargeback')}
										>
											Chargeback
											<SortIcon
												active={sortBy === 'chargeback'}
												dir={sortDir}
											/>
										</th>
										<th
											className="w-[15%] pb-3 px-4 font-medium cursor-pointer select-none text-center border-r border-gray-700 hover:text-white transition-colors"
											onClick={() => handleSort('bid_status')}
										>
											Booking status
											<SortIcon
												active={sortBy === 'bid_status'}
												dir={sortDir}
											/>
										</th>
										<th
											className="w-[18%] pb-3 px-4 font-medium cursor-pointer select-none text-center border-r border-gray-700 hover:text-white transition-colors"
											onClick={() => handleSort('datetime')}
										>
											Date
											<SortIcon active={sortBy === 'datetime'} dir={sortDir} />
										</th>
										<th
											className="w-[16%] pb-3 px-4 font-medium cursor-pointer select-none text-center hover:text-white transition-colors"
											onClick={() => handleSort('agent_name')}
										>
											Agent
											<SortIcon
												active={sortBy === 'agent_name'}
												dir={sortDir}
											/>
										</th>
									</tr>
								</thead>
								<tbody className="text-sm">
									{loading ? (
										<tr>
											<td
												colSpan="7"
												className="py-8 text-center text-gray-400"
											>
												Loading...
											</td>
										</tr>
									) : sortedRecords.length === 0 ? (
										<tr>
											<td
												colSpan="7"
												className="py-8 text-center text-gray-400"
											>
												No data found
											</td>
										</tr>
									) : (
										sortedRecords.map((row, idx) => (
											<BookingDetailRow key={row.bid || idx} data={row} />
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
					{/* Pagination Section */}
					<div className="flex-shrink-0">
						{totalPages > 0 && (
							<div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-t border-gray-700 bg-gray-800/60 gap-2">
								<div className="text-sm text-gray-400 mb-2 md:mb-0">
									Showing
									{data.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
									to {Math.min(currentPage * itemsPerPage, data.total)} of
									{data.total} records
								</div>
								<div className="flex items-center gap-4">
									<div className="flex gap-2">
										<button
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1 || loading}
											className="px-3 py-1 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Previous
										</button>
										<div className="flex items-center gap-1">
											{Array.from({ length: totalPages }, (_, i) => i + 1).map(
												(p) => (
													<button
														key={p}
														onClick={() => handlePageChange(p)}
														disabled={loading}
														className={`w-8 h-8 text-sm rounded-lg ${
															currentPage === p
																? 'bg-blue-500 text-white'
																: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
														} disabled:opacity-50 disabled:cursor-not-allowed`}
													>
														{p}
													</button>
												)
											)}
										</div>
										<button
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages || loading}
											className="px-3 py-1 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Next
										</button>
									</div>
									{/* Rows per page selector */}
									<div className="flex items-center gap-2">
										<span className="text-gray-400 text-sm">
											Rows per page:
										</span>
										<select
											value={itemsPerPage}
											onChange={(e) => handleRowsPerPageChange(e.target.value)}
											disabled={loading}
											className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{[5, 10, 20, 50].map((value) => (
												<option key={value} value={value}>
													{value}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default RevenueDetails;
