import { useState, useEffect, useCallback } from 'react';
import { StatsCard } from '../../features/dashboard/widgets/StatsCard';
import { TopPerformers } from '../../features/dashboard/widgets/TopPerformers';
import { Plane, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { TimelineSelector } from '../common';
import { useAuth } from '../../auth/hooks/useAuth';
import { useHasRole } from '../../auth/hooks/useRole';
import { dashboardOverviewApi } from '../../api/dashboard/dashboardApi';
import { showPromiseToast } from '../../utils/showPromiseToast';

export default function AdminDashboard() {
	const [dateRange, setDateRange] = useState(null); // Start with null, let TimelineSelector initialize it
	const [summary, setSummary] = useState(null);
	// const [topBottom, setTopBottom] = useState(null);
	const { user } = useAuth();
	const isAgent = useHasRole('agent');

	// Memoize the date range change handler to prevent unnecessary re-renders
	const handleDateRangeChange = useCallback((range) => {
		// console.log("Date range changed:", range);
		setDateRange(range);
	}, []);

	useEffect(() => {
		// Only fetch data if dateRange is set (not null)
		if (!dateRange) return;

		const fetchDashboardData = async (range) => {
			// Format dates to YYYY-MM-DD format to avoid timezone issues
			const formatDateForAPI = (date) => {
				if (!date) return null;
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			};

			const payload = {
				userId: user?.id,
				date_to: formatDateForAPI(range.end),
				date_from: formatDateForAPI(range.start),
				dateFilter: 'custom',
				startDate: formatDateForAPI(range.start),
				endDate: formatDateForAPI(range.end),
			};
			try {
				const summaryRes = await showPromiseToast(
					dashboardOverviewApi(payload),
					{
						loading: 'Loading dashboard...',
						success: 'Dashboard loaded!',
						error: 'Failed to load dashboard',
					}
				);
				// console.log('Dashboard Summary:', summaryRes);
				setSummary(summaryRes);
			} catch (err) {
				setSummary(null);
			}
		};
		fetchDashboardData(dateRange);
	}, [dateRange, user?.id]);

	return (
		<div className="max-w-7xl mx-auto">
			<div className="rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700 overflow-hidden mb-4">
				<div className="sticky top-0 z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 min-h-[72px] border-b border-gray-700 bg-gray-800/95 backdrop-blur-sm">
					<h3 className="text-xl font-semibold text-white">
						Dashboard Overview
					</h3>
					<TimelineSelector onRangeChange={handleDateRangeChange} />
				</div>

				<div className="p-4 space-y-3">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
						<StatsCard
							title="Total Bookings"
							value={summary ? summary.totalBookings : '-'}
							icon={Plane}
							color="blue"
						/>
						<StatsCard
							title="Active Agents"
							value={summary ? summary.activeAgents : '-'}
							icon={Users}
							color="green"
						/>
						<StatsCard
							title="Revenue"
							value={summary ? summary.revenue : '-'}
							icon={TrendingUp}
							color="purple"
						/>
						<StatsCard
							title="Chargeback + Refund"
							value={summary ? Number(summary.chargeback_refund) : '-'}
							icon={AlertTriangle}
							color="red"
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
						<TopPerformers
							dateRange={dateRange}
							data={
								Array.isArray(summary?.topPerformers)
									? summary.topPerformers.map((agent) => ({
											id: agent.agent_id,
											name: agent.agent_name,
											revenue: agent.totalRevenue,
											bookings: agent.totalBookings,
											badge: 'Top Performer',
									  }))
									: []
							}
						/>
						{!isAgent && (
							<TopPerformers
								dateRange={dateRange}
								data={
									Array.isArray(summary?.bottomPerformers)
										? summary.bottomPerformers.map((agent) => ({
												id: agent.agent_id,
												name: agent.agent_name,
												revenue: agent.totalRevenue,
												bookings: agent.totalBookings,
												badge: 'Bottom Performer',
										  }))
										: []
								}
								showBottom={true}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
