import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

/**
 * AsideTable - Reusable slide-in aside panel with overlay, close button, and content area for table/search UI.
 *
 * Props:
 *  - open: boolean (controls visibility)
 *  - onClose: function (called when overlay or close button is clicked)
 *  - title: string (optional, for accessibility)
 *  - searchInput: ReactNode (search input bar)
 *  - children: ReactNode (table/list content)
 *  - overlayClassName: string (optional, override overlay style)
 *  - panelClassName: string (optional, override panel style)
 */
export default function AsideTable({
	open = false,
	onClose,
	title = "",
	columns = [], // [{ key, label }]
	data = [], // [{...}]
	searchPlaceholder = "Search...",
	emptyMessage = "No data found.",
	pageSize = 10,
	headerActions = null, // ReactNode for header actions (e.g., refresh button)
	overlayClassName = "fixed inset-0 z-[99] bg-transparent backdrop-blur-[4px] transition-opacity duration-300",
	panelClassName = "fixed top-0 right-0 h-screen w-[50vw] max-w-[700px] min-w-[360px] z-[100] bg-gray-900 shadow-2xl border-l border-gray-800 flex flex-col animate-slide-in-aside-table",
}) {
	const [search, setSearch] = React.useState("");
	const [page, setPage] = React.useState(1);

	React.useEffect(() => {
		setPage(1);
	}, [search, data]);

	// Filtered data
	const filteredData = React.useMemo(() => {
		if (!search) return data;
		const lower = search.toLowerCase();
		return data.filter((row) =>
			columns.some((col) =>
				String(row[col.key] ?? "")
					.toLowerCase()
					.includes(lower)
			)
		);
	}, [search, data, columns]);

	// Pagination
	const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
	const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

	if (!open) return null;

	return ReactDOM.createPortal(
		<>
			{/* Overlay */}
			<div
				className={overlayClassName}
				onClick={onClose}
				aria-label={`Close ${title || "Aside"} Overlay`}
			/>
			{/* Slide-in Panel */}
			<aside
				className={panelClassName}
				role="dialog"
				aria-modal="true"
				aria-label={title}
			>
				{/* Close Button (square, top-left inside panel, centered X) */}
				<button
					className="absolute top-4 left-[-3rem] w-8 h-8 bg-gray-900 border rounded-lg flex items-center justify-center text-red-500 border-red-400 transition-all z-10"
					onClick={onClose}
					aria-label={`Close ${title || "Aside"}`}
					tabIndex={0}
				>
					<span className="text-3xl font-bold leading-none">
						<X size={24} />
					</span>
				</button>
				{/* Panel Content */}
				<div className="flex flex-col h-full p-0">
					{/* Header Section - Combined title/actions and search */}
					<div className="p-4 border-b border-gray-800 space-y-4">
						{/* Title and Actions Row */}
						{(title || headerActions) && (
							<div className="flex items-center justify-between h-8">
								{title && (
									<h2 className="text-lg font-semibold text-gray-200">
										{title}
									</h2>
								)}
								{headerActions && (
									<div className="flex items-center gap-2">{headerActions}</div>
								)}
							</div>
						)}
						{/* Search Input Row */}
						<div className="flex items-center h-8">
							<input
								type="text"
								placeholder={searchPlaceholder}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="bg-gray-800 text-gray-200 rounded px-3 py-2 w-full h-full focus:outline-none focus:ring focus:ring-blue-500/40"
							/>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto p-4">
						{pagedData.length === 0 ? (
							<div className="p-6 text-center text-gray-400">
								{emptyMessage}
							</div>
						) : (
							<table className="w-full text-sm">
								<thead>
									<tr>
										{columns.map((col) => (
											<th
												key={col.key}
												className="py-2 px-4 text-left text-gray-400 font-semibold border-b border-gray-700/50"
												style={{
													width: col.width || "auto",
													minWidth: col.minWidth || "80px",
													maxWidth: col.maxWidth || "300px",
												}}
											>
												{col.label}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{pagedData.map((row, idx) => (
										<tr
											key={idx}
											className="border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors even:bg-gray-800/50"
										>
											{columns.map((col) => (
												<td
													key={col.key}
													className="py-3 px-4 text-gray-300 break-words whitespace-normal"
													style={{
														width: col.width || "auto",
														minWidth: col.minWidth || "80px",
														maxWidth: col.maxWidth || "300px",
													}}
												>
													{row[col.key]}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						)}
						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex justify-center items-center gap-2 mt-4">
								<button
									className="px-3 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 disabled:opacity-50"
									onClick={() => setPage(page - 1)}
									disabled={page === 1}
								>
									Prev
								</button>
								<span className="text-gray-400">
									Page {page} of {totalPages}
								</span>
								<button
									className="px-3 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 disabled:opacity-50"
									onClick={() => setPage(page + 1)}
									disabled={page === totalPages}
								>
									Next
								</button>
							</div>
						)}
					</div>
				</div>
			</aside>
			{/* Animation styles */}
			<style>{`
        @keyframes slide-in-aside-table {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-aside-table {
          animation: slide-in-aside-table 0.35s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
		</>,
		document.body
	);
}
