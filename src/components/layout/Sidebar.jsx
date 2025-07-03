import React, { useState } from "react";
import { Logo } from "../common";
import { Navigation } from "../layout";
import UserProfile from "../../features/user/UserProfile";
import { ChevronLeft, ChevronRight, Plane } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import logo from "../../assets/tripfairs-logo.png";
import logoFull from "../../assets/tripfairs.webp";

function getRoleName(role_id) {
	switch (role_id) {
		case 1:
			return "admin";
		case 2:
			return "leader";
		case 3:
			return "agent";
		default:
			return "";
	}
}

function Sidebar({ collapsed, onToggleCollapse }) {
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const { user } = useAuth();
	const roleName = getRoleName(user?.role_id);

	return (
		<div
			className={`relative h-full flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-lg border-r border-gray-700 shadow-lg transition-all duration-200 ${
				collapsed ? "w-20" : "w-64"
			}`}
			style={{ zIndex: 50 }}
		>
			{/* Top Section with Profile */}
			<div className="relative h-16 border-b border-gray-700 flex items-center">
				<div
					className={`flex items-center ${
						collapsed ? "justify-center w-full" : "px-3"
					}`}
				>
					<div className="relative z-[60]">
						<UserProfile
							showMenu={showProfileMenu}
							setShowMenu={setShowProfileMenu}
						/>
					</div>
					{!collapsed && (
						<div className="flex flex-col ml-3">
							<span className="text-sm font-medium text-white">
								{user?.firstName} {user?.lastName}
							</span>
							<span className="text-xs text-gray-400">{roleName}</span>
						</div>
					)}
				</div>
				{/* Collapse Button */}
				<button
					className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 transition-colors duration-200 shadow-md border border-gray-600"
					onClick={onToggleCollapse}
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
				</button>
			</div>
			{/* Navigation */}
			<div className="flex-1 overflow-y-auto">
				<Navigation iconOnly={collapsed} />
			</div>
			{/* Bottom Logo Section */}
			<div
				className={`h-16 border-t border-gray-700 flex items-center ${
					collapsed ? "justify-center" : "px-4"
				}`}
			>
				{collapsed ? (
					<div className="p-2 bg-gray-700 rounded-lg">
						<img
							src={logo}
							alt="TripFairs"
							className="w-8 h-8 brightness-0 invert"
						/>
					</div>
				) : (
					<div className="w-full flex justify-center items-center">
						<img
							src={logoFull}
							alt="TripFairs"
							className="h-12 brightness-0 invert"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default Sidebar;
