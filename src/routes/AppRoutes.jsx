import {
	Routes,
	Route,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Dashboard, Sidebar } from "../components/layout";
import { ManageBookings } from "../features/booking";
import { Revenue } from "../features/revenue";
import { IPSetting } from "../features/ip";
import EmailPreviewPage from "../pages/EmailPreviewPage";
import FindBookings from "../features/booking/FindBookings";
import ManageUsers from "../features/user/ManageUsers";
import ManageData from "../features/data/ManageData";
import RevenueDetails from "../features/revenue/RevenueDetails";
import UserProfile from "../features/user/UserProfile";
import Login from "../pages/Login";
import ProfilePage from "../features/user/ProfilePage";
import BookingDetails from "../features/booking/BookingDetails";
import NewBooking from "../features/booking/components/NewBooking";
import Exchange from "../features/booking/components/Exchange";
import SeatAssignment from "../features/booking/components/SeatAssignment";
import Upgrade from "../features/booking/components/Upgrade";
import CancelForRefund from "../features/booking/components/CancelForRefund";
import CancelForFutureCredit from "../features/booking/components/CancelForFutureCredit";
import OtpScreen from "../pages/OtpScreen";
import RoleProtectedRoute from "../auth/RoleProtectedRoute";
import AccessDenied from "../pages/AccessDenied";
import ProtectedRoute from "../auth/ProtectedRoute";
import OtpManagement from "../features/user/OtpManagement";

export default function AppRoutes() {
	const navigate = useNavigate();
	const location = useLocation();

	// Initialize sidebar state from localStorage or default to false
	const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
		const saved = sessionStorage.getItem("sidebarCollapsed");
		return saved ? JSON.parse(saved) : false;
	});

	// Save sidebar state to localStorage whenever it changes
	useEffect(() => {
		sessionStorage.setItem(
			"sidebarCollapsed",
			JSON.stringify(sidebarCollapsed)
		);
	}, [sidebarCollapsed]);

	const handleToggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	const hideSidebarRoutes = [
		/^\/find-bookings\/[^/]+$/, // regex for /find-bookings/:bid
		/^\/email-preview$/,
		/^\/revenue\/details\/[^/]+$/, // regex for /revenue/details/:bid
	];

	const shouldHideSidebar = hideSidebarRoutes.some((regex) =>
		regex.test(location.pathname)
	);

	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/otp" element={<OtpScreen />} />
			<Route
				path="/*"
				element={
					<ProtectedRoute>
						<div className="min-w-full h-screen box-border bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
							<div className="flex w-full h-full">
								{!shouldHideSidebar && (
									<Sidebar
										collapsed={sidebarCollapsed}
										onToggleCollapse={handleToggleSidebar}
									/>
								)}
								<div className="flex-1 overflow-y-auto">
									<div className="p-4 h-full">
										<Routes>
											<Route index element={<Dashboard />} />
											<Route
												path="manage-bookings"
												element={<ManageBookings />}
											/>
											<Route
												path="manage-bookings/new-booking"
												element={<NewBooking onBack={() => navigate(-1)} />}
											/>
											<Route
												path="manage-bookings/exchange"
												element={<Exchange onBack={() => navigate(-1)} />}
											/>
											<Route
												path="manage-bookings/seat-assignment"
												element={<SeatAssignment onBack={() => navigate(-1)} />}
											/>
											<Route
												path="manage-bookings/upgrade"
												element={<Upgrade onBack={() => navigate(-1)} />}
											/>
											<Route
												path="manage-bookings/cancel-for-refund"
												element={
													<CancelForRefund onBack={() => navigate(-1)} />
												}
											/>
											<Route
												path="manage-bookings/cancel-for-future-credit"
												element={
													<CancelForFutureCredit onBack={() => navigate(-1)} />
												}
											/>{" "}
											<Route path="find-bookings" element={<FindBookings />} />
											<Route
												path="find-bookings/:bid"
												element={<BookingDetails />}
											/>
											<Route path="revenue" element={<Revenue />} />
											<Route
												path="revenue/details"
												element={<RevenueDetails />}
											/>
											<Route
												path="revenue/details/:bid"
												element={<BookingDetails />}
											/>
											<Route
												path="manage-users"
												element={
													<RoleProtectedRoute allowedRoles={["1", "2"]}>
														<ManageUsers />
													</RoleProtectedRoute>
												}
											/>
											<Route
												path="details/user/:id"
												element={<ProfilePage />}
											/>
											<Route
												path="manage-data"
												element={
													<RoleProtectedRoute allowedRoles={["1"]}>
														<ManageData />
													</RoleProtectedRoute>
												}
											/>
											<Route
												path="otp-management"
												element={<OtpManagement />}
											/>
											<Route
												path="ip-setting"
												element={
													<RoleProtectedRoute allowedRoles={["1"]}>
														<IPSetting />
													</RoleProtectedRoute>
												}
											/>{" "}
											<Route path="access-denied" element={<AccessDenied />} />
											<Route
												path="email-preview"
												element={<EmailPreviewPage />}
											/>
											<Route path="profile" element={<ProfilePage />} />
											<Route path="*" element={<Navigate to="/" />} />
										</Routes>
									</div>
								</div>
							</div>
						</div>
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}
