import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	User,
	Mail,
	Calendar,
	Building,
	Shield,
	Award,
	ArrowLeft,
	Users,
	Ticket,
	DollarSign,
	AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDataContext } from '../../context/DataContext';
import { dashboardOverviewApi } from '../../api/dashboard/dashboardApi';
import {
	getCurrentESTDate,
	formatESTDateForInput,
} from '../../utils/formatters';

function ProfilePage() {
	const location = useLocation();
	const { user: authUser } = useAuth();
	const { leaders } = useDataContext();
	const user = location.state?.user || authUser;
	const navigate = useNavigate();

	// State for dashboard data
	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true); // Fetch dashboard data
	useEffect(() => {
		async function fetchDashboardData() {
			if (!user?.id) return;
			try {
				setLoading(true);

				// Set default date range to current month in EST timezone
				const now = new Date();
				// Convert to EST timezone (UTC-5, or UTC-4 during daylight saving time)
				const estNow = new Date(
					now.toLocaleString('en-US', { timeZone: 'America/New_York' })
				);
				const currentYear = estNow.getFullYear();
				const currentMonth = String(estNow.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1
				const firstDay = `${currentYear}-${currentMonth}-01`;
				const lastDay = new Date(
					currentYear,
					estNow.getMonth() + 1,
					0
				).getDate(); // Get last day of current month
				const date_from = firstDay;
				const date_to = `${currentYear}-${currentMonth}-${String(
					lastDay
				).padStart(2, '0')}`;

				const dashboardData = await dashboardOverviewApi({
					userId: user.id,
					date_from,
					date_to,
				});
				// console.log(dashboardData);
				setDashboard(dashboardData || null);
			} catch (err) {
				// console.error('Failed to fetch dashboard data:', err);
				setDashboard(null);
			} finally {
				setLoading(false);
			}
		}

		fetchDashboardData();
	}, [user?.id]);

	// Map role_id and status to display values
	const getRole = (role_id) => {
		switch (role_id) {
			case '1':
			case 1:
				return 'Admin';
			case '2':
			case 2:
				return 'Leader';
			case '3':
			case 3:
				return 'Agent';
			default:
				return 'Unknown';
		}
	};
	const isActive = user?.status === '1' || user?.status === 1;
	const joinedDate = user?.created_at ? user.created_at.split(' ')[0] : 'N/A';
	const team =
		user?.role_id === '3' || user?.role_id === 3
			? `${user?.alias || user?.email}'s Team`
			: 'Not Assigned';
	const userData = {
		name: user?.alies_name || user?.name || 'Guest',
		role: getRole(user?.role_id),
		isActive,
		email: user?.email || 'N/A',
		// Use real dashboard data if available, otherwise fallback to 0
		monthlyMCO: dashboard?.revenue || 0,
		totalBookings: dashboard?.totalBookings || 0,
		monthlyChargeback: Number(dashboard?.chargeback_refund || 0),
		alias: user?.id || 'N/A',
		team,
		joinedDate,
		permissions: user?.permissions || [],
	};

	if (!userData) {
		return (
			<div className="max-w-3xl mx-auto p-6 text-center text-gray-400">
				No user data available
			</div>
		);
	}

	const StatCard = ({
		icon: Icon,
		label,
		value,
		valueColor = 'text-white',
	}) => (
		<div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
			<div className="flex items-center space-x-3">
				<div className="p-2 bg-gray-600 rounded-lg">
					<Icon className="w-5 h-5 text-blue-400" />
				</div>
				<div>
					<p className="text-sm text-gray-400">{label}</p>
					<p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
				</div>
			</div>
		</div>
	);

	// Find leader name from leaders context if leader_id exists
	let leaderDisplay = null;
	if (user?.leader_id && leaders && leaders.length > 0) {
		const foundLeader = leaders.find(
			(l) => String(l.id) === String(user.leader_id)
		);
		if (foundLeader) {
			leaderDisplay =
				foundLeader.name || foundLeader.alias || foundLeader.email;
		}
	}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			{/* Back Button */}
			<button
				onClick={() => navigate(-1)}
				className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back
			</button>
			{/* Profile Header */}
			<div className="rounded-xl bg-gray-800 bg-opacity-70 backdrop-blur-lg border border-gray-700">
				<div className="p-4">
					<div className="flex items-center space-x-4">
						<div className="p-2 bg-gray-700 rounded-xl">
							<User className="w-12 h-12 text-blue-400" />
						</div>
						<div className="flex-1">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-lg font-bold text-white">
										{userData.name}
									</h2>
									<p className="text-xs text-gray-400">{userData.role}</p>
									{/* Show leader name if leader_id exists and found in leaders */}
									{user?.leader_id && leaderDisplay && (
										<p className="text-xs text-blue-400 mt-1">
											Team Leader: {leaderDisplay}
										</p>
									)}
								</div>
								<span
									className={`px-2 py-0.5 text-xs rounded-full ${
										userData.isActive
											? 'bg-green-500/20 text-green-400'
											: 'bg-red-500/20 text-red-400'
									}`}
								>
									{userData.isActive ? 'Active' : 'Inactive'}
								</span>
							</div>
							<div className="mt-2 flex items-center space-x-3 text-xs text-gray-400">
								<div className="flex items-center">
									<Mail className="w-3 h-3 mr-1" />
									{userData.email}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Stats Container */}
			<div className="rounded-xl bg-gray-800 bg-opacity-70 backdrop-blur-lg border border-gray-700">
				<div className="p-4 border-b border-gray-700 flex justify-between items-center">
					<h3 className="text-base font-semibold text-white">Stats</h3>
					<span className="text-xs text-gray-400">{`Monthly Stats (${new Date().toLocaleString(
						'en-US',
						{ month: 'long' }
					)})`}</span>
				</div>
				{/* Stats Grid */}
				<div className="p-4">
					{loading ? (
						<div className="flex justify-center items-center py-8">
							<div className="text-gray-400">Loading stats...</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{' '}
							<StatCard
								icon={DollarSign}
								label="MCO"
								value={`${userData.monthlyMCO || 0}`}
								valueColor="text-green-400"
							/>
							<StatCard
								icon={Ticket}
								label="Total Bookings"
								value={userData.totalBookings}
							/>{' '}
							<StatCard
								icon={AlertCircle}
								label="Chargeback + Refund"
								value={`${userData.monthlyChargeback || 0}`}
								valueColor="text-red-400"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
