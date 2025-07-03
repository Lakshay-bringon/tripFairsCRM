import React, { useRef, useEffect, useState } from 'react';
import { User, Settings, LogOut, Mail, Phone, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import ChangePasswordModal from './ChangePasswordModal';

function UserProfile({ showMenu, setShowMenu }) {
	const menuRef = useRef(null);
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [showChangePassword, setShowChangePassword] = useState(false);

	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMenu(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			setShowMenu(false);
			navigate('/login');
		} catch (error) {
			// console.error("Logout failed:", error);
		}
	};

	return (
		<div className="relative" ref={menuRef}>
			<button
				className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all duration-200 shadow-md overflow-hidden"
				onMouseEnter={() => setShowMenu(true)}
			>
				<User className="w-5 h-5 text-blue-400" />
			</button>

			{showMenu && (
				<div
					className="absolute left-0 mt-2 w-64 rounded-lg bg-gray-800 border border-gray-700 shadow-xl py-1 z-[1000] max-h-[calc(100vh-80px)] overflow-y-auto"
					onMouseLeave={() => setShowMenu(false)}
				>
					<Link
						to={`/details/user/${user?.id}`}
						className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
						onClick={() => setShowMenu(false)}
					>
						<User className="w-4 h-4 mr-2" />
						View Profile
					</Link>
					<button
						className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
						onClick={() => setShowChangePassword(true)}
					>
						<Settings className="w-4 h-4 mr-2" />
						Change Password
					</button>
					<div className="border-t border-gray-700 mt-1">
						<button
							onClick={handleLogout}
							className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</button>
					</div>
				</div>
			)}
			{showChangePassword && (
				<ChangePasswordModal onClose={() => setShowChangePassword(false)} />
			)}
		</div>
	);
}

export default UserProfile;
