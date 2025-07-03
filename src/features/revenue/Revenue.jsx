import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	DollarSign,
	AlertTriangle,
	Search,
	RotateCcw,
	Filter,
	FileText,
	BarChart2,
} from 'lucide-react';
import { StatsCard } from '../../features/dashboard/widgets/StatsCard';
import { TimelineSelector } from '../../components/common';
import { getUserListApi, getTeamApi } from '../../api/user/userApi';
import { getProvidersApi } from '../../api/provider/providerApi';
import {
	getRevenueDashboardApi,
	getRevenueListApi,
} from '../../api/revenue/revenueApi';
import { useAuth } from '../../auth/hooks/useAuth';
import { useHasRole } from '../../auth/hooks/useRole';
import { showPromiseToast } from '../../utils/showPromiseToast';
import {
	formatESTDateForInput,
	getCurrentESTDate,
} from '../../utils/formatters';
import toast from 'react-hot-toast';

function Revenue() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const isAgent = useHasRole('agent');
	const isLeader = useHasRole('leader');
	const [dateRange, setDateRange] = useState({
		start: getCurrentESTDate(),
		end: getCurrentESTDate(),
	});
	const [filters, setFilters] = useState({
		agent: '',
		provider: '',
		includeRefund: false,
		includeChargeback: false,
	});
	const [agents, setAgents] = useState([]);
	const [providers, setProviders] = useState([]);
	const [dashboard, setDashboard] = useState(null);
	useEffect(() => {
		async function fetchData() {
			try {
				// Determine which API to use for fetching agents based on role
				const userListPromise = isLeader
					? getTeamApi(user?.id)
					: getUserListApi();

				const [userList, providerList, dashboardData] = await Promise.all([
					userListPromise,
					getProvidersApi(),
					getRevenueDashboardApi(user?.id),
				]);
				setAgents(userList || []);
				setProviders(providerList || []);
				setDashboard(dashboardData || null);
			} catch (err) {
				// console.error('Failed to fetch data:', err);
			}
		}
		if (user?.id) fetchData();
	}, [user?.id, isLeader]);

	const handleDateRangeChange = (range) => {
		setDateRange(range);
	};

	const handleFilterChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSearch = async (e) => {
		e.preventDefault();

		const formatDateForAPI = (date) => {
			if (!date) return null;
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		};

		const payload = {
			userId: user?.id,
			agent_id: filters.agent || undefined,
			provider_id: filters.provider || undefined,
			show_refund: filters.includeRefund ? true : undefined,
			show_chargeback: filters.includeChargeback ? true : undefined,
			date_from: formatDateForAPI(dateRange.start),
			date_to: formatDateForAPI(dateRange.end),
		};

		try {
			const data = await showPromiseToast(getRevenueListApi(payload), {
				loading: 'Fetching detailed revenue...',
				success: 'Revenue data loaded!',
				error: 'Failed to fetch detailed revenue',
			});

			if (Array.isArray(data['records']) && data['records'].length > 0) {
				navigate('/revenue/details', {
					state: {
						searchParams: payload,
						results: data,
					},
					replace: true,
				});
			}
			if (data['records'].length === 0) {
				toast.error('No records found.');
			}
		} catch (err) {
			// console.error('Failed to fetch detailed revenue:', err);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			<h2 className="text-xl font-semibold text-gray-200 mb-2 ml-2">
				Lifetime Stats
			</h2>
			<div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
					<StatsCard
						title="Total Revenue"
						value={dashboard ? dashboard.totalRevenue : '$0'}
						icon={DollarSign}
						color="blue"
					/>
					<StatsCard
						title="Chargeback"
						value={dashboard ? dashboard.chargeBack : '$0'}
						icon={AlertTriangle}
						color="red"
					/>
					<StatsCard
						title="Refund"
						value={dashboard ? dashboard.totalRefund : '$0'}
						icon={RotateCcw}
						color="orange"
					/>
					<StatsCard
						title="Net Revenue"
						value={
							dashboard
								? (
										dashboard.totalRevenue * 0.95 -
										(dashboard.totalRefund + dashboard.chargeBack)
								  ).toFixed(2)
								: '$0'
						}
						icon={FileText}
						color="green"
					/>
				</div>
			</div>{' '}
			{/* Search Form Container */}
			<div className="rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700 overflow-hidden">
				<div className="p-4">
					<form onSubmit={handleSearch}>
						<div className="space-y-4">
							{' '}
							{/* Compact Form Layout */}
							<div className="flex flex-col lg:flex-row gap-4 items-end">
								{/* Date Range - takes all available space */}
								<div className="flex-1 w-full space-y-2">
									<label className="block text-sm font-medium text-gray-400">
										Date Range
									</label>
									<div className="w-full">
										<TimelineSelector onRangeChange={handleDateRangeChange} />
									</div>
								</div>

								{/* Search Button */}
								<div className="flex-shrink-0">
									<button
										type="submit"
										className="w-full lg:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
									>
										<Search className="w-4 h-4" />
										Search
									</button>
								</div>
							</div>{' '}
							{/* Filters Row - spread across full width */}
							<div className="flex flex-wrap items-center justify-between gap-4 bg-gray-700/30 px-4 py-3 rounded-lg w-full">
								<span className="text-sm font-medium text-gray-400">
									Filters:
								</span>{' '}
								{/* Agent Filter - hidden for agent role */}
								{!isAgent && (
									<div className="flex items-center gap-2">
										<label className="text-sm text-gray-400">Agent:</label>
										<select
											name="agent"
											value={filters.agent}
											onChange={handleFilterChange}
											className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-blue-500"
										>
											<option value="">All</option>
											{agents.map((agent) => (
												<option key={agent.id} value={agent.id}>
													{agent.name}
												</option>
											))}
										</select>
									</div>
								)}
								{/* Provider Filter */}
								<div className="flex items-center gap-2">
									<label className="text-sm text-gray-400">Provider:</label>
									<select
										name="provider"
										value={filters.provider}
										onChange={handleFilterChange}
										className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-blue-500"
									>
										<option value="">All</option>
										{providers.map((provider) => (
											<option key={provider.id} value={provider.id}>
												{provider.name}
											</option>
										))}
									</select>
								</div>
								{/* Refund Checkbox */}
								<label className="flex items-center gap-2 text-sm text-gray-300">
									<input
										type="checkbox"
										name="includeRefund"
										checked={filters.includeRefund}
										onChange={handleFilterChange}
										className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
									/>
									Refund
								</label>
								{/* Chargeback Checkbox */}
								<label className="flex items-center gap-2 text-sm text-gray-300">
									<input
										type="checkbox"
										name="includeChargeback"
										checked={filters.includeChargeback}
										onChange={handleFilterChange}
										className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
									/>
									Chargeback
								</label>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Revenue;
