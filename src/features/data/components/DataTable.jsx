import React, { useMemo } from "react";
import { PenSquare, Trash } from "lucide-react";
import SearchBar from "./SearchBar";
import { LoadingSpinner } from "../../../components/ui";

function DataTable({
	data,
	searchQuery,
	setSearchQuery,
	onEdit,
	onDelete,
	columns,
	loading = false,
	loadingLabel = "Loading...",
	onToggleStatus,
}) {
	// Use columns if provided, else fallback to keys from first data row
	const tableColumns = useMemo(() => {
		if (columns && columns.length > 0) return columns;
		if (data && data.length > 0) return Object.keys(data[0]);
		return [];
	}, [columns, data]);

	// Filter data based on search query
	const filteredData = useMemo(() => {
		if (!searchQuery) return data;
		return data.filter((item) =>
			tableColumns.some((key) =>
				String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [data, searchQuery, tableColumns]);

	// Helper: Render status button for cards/providers
	const renderStatusButton = (row, onToggleStatus, loading) => {
		const isActive =
			row.status === 1 ||
			row.status === "1" ||
			row.status === "ACTIVE" ||
			row.status === "Active";
		return (
			<button
				disabled={loading}
				onClick={() => onToggleStatus(row.id)}
				className={`px-2 py-1 text-xs rounded-full cursor-pointer transition-all duration-200 focus:outline-none
					${
						isActive
							? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400"
							: "bg-red-500/20 text-red-400 hover:bg-green-500/20 hover:text-green-400"
					}
					${loading ? "opacity-60 pointer-events-none" : ""}`}
			>
				{isActive ? "Active" : "Inactive"}
			</button>
		);
	};

	if (loading) {
		return (
			<div className="overflow-x-auto">
				<table className="w-full text-white table-fixed">
					<thead className="bg-gray-700 w-full">
						<tr className="w-full">
							{tableColumns.map((key, index) => (
								<th
									key={index}
									className={`px-3 py-2 text-center text-xs font-semibold w-[140px] truncate`}
								>
									{key.toUpperCase()}
								</th>
							))}
							<th className="px-3 py-2 text-xs text-center font-semibold w-[120px]">
								ACTION
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td
								colSpan={tableColumns.length + 1}
								className="py-8 text-center"
							>
								<LoadingSpinner label={loadingLabel} size="md" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<>
			<div className="overflow-x-auto">
				<table className="w-full text-white table-fixed">
					<thead className="bg-gray-700 w-full">
						<tr className="w-full">
							{tableColumns.map((key, index) => (
								<th
									key={index}
									className={`px-3 py-2 text-center text-xs font-semibold w-[140px] truncate`}
								>
									{key.toUpperCase()}
								</th>
							))}
							<th className="px-3 py-2 text-xs text-center font-semibold w-[120px]">
								ACTION
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((dataObj) => (
							<tr
								key={dataObj.id}
								className="border-b border-gray-700 hover:bg-gray-700/50 w-full"
							>
								{tableColumns.map((key, colIdx) => (
									<td
										key={colIdx}
										className="px-3 py-2 text-sm text-center w-[140px] truncate"
									>
										{/* Provider logo: show using UPLOADS baseurl/dataObj.logo if logo exists */}
										{key === "logo" && dataObj.logo ? (
											<img
												src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
													dataObj.logo
												}`}
												alt="Logo"
												className="h-8 w-8 mx-auto rounded bg-white object-contain border border-gray-600"
												style={{ background: "#fff" }}
											/>
										) : key === "status" &&
										  typeof onToggleStatus === "function" ? (
											renderStatusButton(
												dataObj,
												onToggleStatus,
												dataObj._statusLoading
											)
										) : (
											dataObj[key]
										)}
									</td>
								))}
								<td className="px-3 py-2 text-center w-[120px]">
									<div className="flex justify-center gap-1">
										<button
											onClick={() => onEdit(dataObj)}
											className="p-1 hover:bg-gray-600 rounded"
										>
											<PenSquare className="w-4 h-4 text-blue-400" />
										</button>
										<button
											onClick={() => onDelete(dataObj.id)}
											className="p-1 hover:bg-gray-600 rounded"
										>
											<Trash className="w-4 h-4 text-red-400" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default DataTable;
