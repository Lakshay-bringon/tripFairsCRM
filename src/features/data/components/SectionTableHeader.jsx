import React from "react";
import { X, Plus, Search } from "lucide-react";

export default function SectionTableHeader({
	title,
	onClose,
	searchQuery,
	setSearchQuery,
	onAdd,
	addLabel = "Add New",
}) {
	return (
		<div className="sticky rounded-t-xl top-0 z-10 p-2 border-b border-gray-700 flex justify-between items-center bg-gray-800/95 backdrop-blur-sm">
			<div className="flex items-center gap-4">
				<button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
					<X className="w-5 h-5 text-gray-400" />
				</button>
				<h3 className="text-xl font-semibold text-white">{title}</h3>
			</div>
			<div className="flex-1 px-6 relative">
				<input
					type="text"
					placeholder="Search..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
				<Search className="w-5 h-5 text-gray-400 absolute left-8 top-2.5" />
			</div>
			<button
				onClick={onAdd}
				className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white hover:opacity-90 transition-all duration-200 flex items-center gap-2"
			>
				<Plus className="w-4 h-4" />
				{addLabel}
			</button>
		</div>
	);
}
