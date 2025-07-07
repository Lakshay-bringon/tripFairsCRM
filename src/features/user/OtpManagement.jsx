import React, { useEffect, useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";
import { showPromiseToast } from "../../utils/showPromiseToast";
import { getOtpApi } from "../../api/user/userApi";
// Helper to format seconds as mm:ss

const OTP_EXPIRE_SECONDS = 300; // 5 minutes

export default function OtpManagement() {
	const [otp, setOtp] = useState("------");
	const [timer, setTimer] = useState(OTP_EXPIRE_SECONDS);
	const intervalRef = useRef();
	const [loading, setLoading] = useState(false);

	// Simulate fetching OTP (replace with API call)
	const fetchOtp = async () => {
		setLoading(true);

		const otpResult = await showPromiseToast(
			getOtpApi(), // Replace with actual user ID or payload
			{
				loading: "Fetching OTP...",
				success: () => "OTP fetched successfully",
				error: "Failed to fetch OTP",
			}
		);
		setOtp(otpResult.otp || "------");
		console.log("OTP Result:", otpResult);
		setLoading(false);
	};

	useEffect(() => {
		fetchOtp();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (timer === 0) return;
		intervalRef.current = setInterval(() => {
			setTimer((t) => {
				if (t <= 1) {
					clearInterval(intervalRef.current);
					return 0;
				}
				return t - 1;
			});
		}, 1000);
		return () => clearInterval(intervalRef.current);
	}, [otp]);

	const handleRenew = () => {
		if (!loading) fetchOtp();
	};

	return (
		<div className="flex flex-col items-center justify-center h-full w-full p-6">
			<div className="w-full max-w-md mx-auto">
				<div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-8 flex flex-col items-center">
					<h2 className="text-2xl font-bold mb-4 text-white">OTP Management</h2>
					<div className="mb-6 flex flex-col items-center">
						<span className="text-4xl font-mono tracking-widest text-blue-400 mb-2">
							{otp}
						</span>
						{/* <span className="text-xs text-gray-400">
							Expires in:{" "}
							<span className="font-semibold text-blue-300">
								{formatTime(timer)}
							</span>
						</span> */}
					</div>
					<Button
						onClick={handleRenew}
						disabled={loading}
						className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all duration-200"
					>
						<RefreshCw className="w-4 h-4 mr-1" />
						Refresh
					</Button>
				</div>
			</div>
		</div>
	);
}
