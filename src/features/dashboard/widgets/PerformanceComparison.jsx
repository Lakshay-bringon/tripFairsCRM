import React from "react";
import {
	DollarSign,
	TrendingUp,
	TrendingDown,
	Target,
	User,
	AlertTriangle,
} from "lucide-react";
import { numberFormatter } from "../../../utils/formatters";

function ComparisonCard({ title, currentValue, topValue = false }) {
	return (
		<div className="p-4 rounded-lg border border-gray-600">
			<p className="text-sm text-gray-400 mb-3">{title}</p>

			<div className="space-y-2">
				{/* Current Agent */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<User className="w-4 h-4 text-blue-400" />
						<span className="text-sm text-gray-400">You</span>
					</div>
					<span className="text-white font-medium">{currentValue}</span>
				</div>

				{/* Top Performer */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Target className="w-4 h-4 text-green-400" />
						<span className="text-sm text-gray-400">Top Performer</span>
					</div>
					<span className="text-green-400 font-medium">{topValue}</span>
				</div>
			</div>
		</div>
	);
}

export function PerformanceComparison({ agentData, topPerformer }) {
	return (
		<div className="px-4 py-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800/50">
						<Target className="w-5 h-5 text-blue-400" />
					</div>
					<h3 className="font-medium text-gray-200">
						Monthly Performance Comparison
					</h3>
				</div>
				<div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800/50 text-blue-400 text-sm">
					<DollarSign className="w-4 h-4" />
					<span>vs Top Performer</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-1 gap-3">
				{" "}
				<ComparisonCard
					title="Monthly MCO"
					currentValue={`${agentData.revenue || 0}`}
					topValue={`${topPerformer.revenue || 0}`}
				/>
				<ComparisonCard
					title="Monthly Bookings"
					currentValue={numberFormatter.format(agentData.bookings)}
					topValue={numberFormatter.format(topPerformer.bookings)}
				/>{" "}
				<ComparisonCard
					title="Monthly CB + Refund"
					currentValue={`${agentData.chargeback || 0}`}
					topValue={`${topPerformer.chargeback || 0}`}
				/>
			</div>
		</div>
	);
}
