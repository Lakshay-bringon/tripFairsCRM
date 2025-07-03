import React from "react";

export default function RecordsList({
	title,
	headerContent,
	filterContent,
	list = [],
	CardComponent,
	emptyMessage = "No records found.",
	className = "",
	maxHeight = "calc(100vh - 200px)",
	showPagination = true,
	currentPage = 1,
	totalPages = 1, // will be calculated
	onPageChange,
	itemsPerPage = 10,
	onItemsPerPageChange,
	itemsPerPageOptions = [5, 10, 20, 50, 100],
}) {
	// Calculate total pages
	const calculatedTotalPages = Math.ceil(list.length / itemsPerPage) || 1;
	const page = Math.min(currentPage, calculatedTotalPages);
	const startIdx = (page - 1) * itemsPerPage;
	const endIdx = startIdx + itemsPerPage;
	const paginatedRecords = list.slice(startIdx, endIdx);

	return (
		<div
			className={`rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700 overflow-hidden ${className}`}
		>
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 min-h-[48px] border-b border-gray-700">
				<h3 className="text-xl font-semibold text-white">{title}</h3>
				{headerContent}
			</div>

			{/* Filter Section */}
			{filterContent && (
				<div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800/60">
					{filterContent}
				</div>
			)}

			{/* List Section */}
			<div className="overflow-y-auto" style={{ maxHeight }}>
				{paginatedRecords.length === 0 ? (
					<div className="p-6 text-center text-gray-400">{emptyMessage}</div>
				) : (
					<div>
						{paginatedRecords.map((record, index) => (
							<div
								key={record.id || record.BID || index}
								className={`${
									index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-700/80"
								} hover:bg-blue-900/40 transition-colors duration-150`}
							>
								<CardComponent record={record} />
							</div>
						))}
					</div>
				)}
			</div>

			{/* Pagination Section */}
			{showPagination && (
				<div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-t border-gray-700 bg-gray-800/60 gap-2">
					<div className="text-sm text-gray-400 mb-2 md:mb-0">
						Showing {list.length === 0 ? 0 : startIdx + 1} to{" "}
						{Math.min(endIdx, list.length)} of {list.length} records
					</div>
					<div className="flex items-center gap-4">
						<div className="flex gap-2">
							<button
								onClick={() => onPageChange(page - 1)}
								disabled={page === 1}
								className="px-3 py-1 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							<div className="flex items-center gap-1">
								{Array.from(
									{ length: calculatedTotalPages },
									(_, i) => i + 1
								).map((p) => (
									<button
										key={p}
										onClick={() => onPageChange(p)}
										className={`w-8 h-8 text-sm rounded-lg ${
											page === p
												? "bg-blue-500 text-white"
												: "bg-gray-700 text-gray-300 hover:bg-gray-600"
										}`}
									>
										{p}
									</button>
								))}
							</div>
							<button
								onClick={() => onPageChange(page + 1)}
								disabled={page === calculatedTotalPages}
								className="px-3 py-1 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
						</div>
						{/* Items per page selector */}
						<div className="flex items-center gap-1">
							<span className="text-gray-400 text-sm">Rows per page:</span>
							<select
								value={itemsPerPage}
								onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
								className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm"
							>
								{itemsPerPageOptions.map((opt) => (
									<option key={opt} value={opt}>
										{opt}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
