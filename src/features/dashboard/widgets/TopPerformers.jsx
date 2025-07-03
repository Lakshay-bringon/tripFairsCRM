import React from "react";
import {
	Trophy,
	TrendingUp,
	DollarSignIcon,
	TicketsPlane,
	Users,
	Plane,
	Medal,
	Sparkles,
	DollarSign,
	TrendingDown,
} from "lucide-react";
import { numberFormatter } from "../../../utils/formatters";

const defaultData = [
	{
		id: 1,
		name: "Sarah Wilson",
		role: "Senior Agent",
		revenue: 184500,
		bookings: 145,
		badge: "🏆 Top Performer",
	},
	{
		id: 2,
		name: "Michael Chen",
		role: "Travel Consultant",
		revenue: 162100,
		bookings: 128,
		badge: "⭐ Rising Star",
	},
	{
		id: 3,
		name: "Emma Rodriguez",
		role: "Travel Agent",
		revenue: 158000,
		bookings: 132,
		badge: "🌟 High Achiever",
	},
];

const medalIcons = [
	<Trophy className="w-5 h-5 text-blue-400" />,
	<Medal className="w-5 h-5 text-purple-400" />,
	<Sparkles className="w-5 h-5 text-green-400" />,
];

function PerformerCard({ performer, index, isBottom = false }) {
	return (
		<div className="p-4 rounded-lg border border-gray-600">
			<div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
				<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/50">
					{isBottom ? (
						<TrendingDown className="w-5 h-5 text-red-400" />
					) : (
						medalIcons[index]
					)}
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<span className="text-gray-200 font-medium">{performer.name}</span>
						{performer.badge && (
							<span
								className={`text-xs px-2 py-0.5 rounded-full ${
									index === 0
										? "bg-blue-500/20 text-blue-400"
										: index === 1
										? "bg-purple-500/20 text-purple-400"
										: "bg-green-500/20 text-green-400"
								}`}
							>
								{performer.badge}
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<DollarSign className="w-4 h-4 text-green-400" />
						<span className="text-sm text-gray-400">MCO Revenue</span>
					</div>
					<span className="text-white font-medium">
						{performer.revenue || 0}
					</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Plane className="w-4 h-4 text-blue-400" />
						<span className="text-sm text-gray-400">Total Bookings</span>
					</div>
					<span className="text-white font-medium">
						{numberFormatter.format(performer.bookings)}
					</span>
				</div>
			</div>
		</div>
	);
}

export function TopPerformers({ data = defaultData, showBottom = false }) {
	const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);
	const displayData = showBottom
		? sortedData.slice(-3).reverse()
		: sortedData.slice(0, 3);

	return (
		<div className="px-4 py-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800/50">
						{showBottom ? (
							<TrendingDown className="w-5 h-5 text-red-400" />
						) : (
							<Trophy className="w-5 h-5 text-yellow-400" />
						)}
					</div>
					<h3 className="font-medium text-gray-200">
						{showBottom ? "Bottom Performers" : "Top Performers"}
					</h3>
				</div>
				<div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800/50 text-green-400 text-sm">
					<DollarSign className="w-4 h-4" />
					<span>MCO</span>
				</div>
			</div>
			<div className="grid gap-2">
				{displayData.map((performer, index) => (
					<PerformerCard
						key={performer.id}
						performer={performer}
						index={index}
						isBottom={showBottom}
					/>
				))}
			</div>
		</div>
	);
}
