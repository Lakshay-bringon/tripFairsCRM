import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logoFull from "../assets/tripfairs.webp";
import { useAuth } from "../auth/hooks/useAuth";

function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [isResetMode, setIsResetMode] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [resetEmail, setResetEmail] = useState("");
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { login, forgetPassword } = useAuth();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");
		if (!isResetMode) {
			try {
				setIsLoading(true);
				await login(email, password);
				setIsLoading(false);
				navigate("/otp", { state: { email } });
			} catch (err) {
				setIsLoading(false);
				setError(err.message || "An error occurred during login");
			}
		} else {
			try {
				setIsLoading(true);
				const message = await forgetPassword(resetEmail);
				setIsLoading(false);
				setSuccessMessage(message);
				// Reset form and switch back to login mode after successful reset
				setTimeout(() => {
					setIsResetMode(false);
					setSuccessMessage("");
					setResetEmail("");
				}, 3000);
			} catch (err) {
				setIsLoading(false);
				setError(err.message || "An error occurred during password reset");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<div className="w-full max-w-md p-8 rounded-2xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700 shadow-xl">
				<div className="text-center mb-8">
					<div className="flex justify-center items-center mb-2">
						<img src={logoFull} alt="TheFlightsBooking" className="h-16" />
					</div>
				</div>
				<form onSubmit={handleSubmit} className="space-y-6">
					{!isResetMode ? (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-2">
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
									<input
										type="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
										placeholder="Enter your email"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-2">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
									<input
										type={showPassword ? "text" : "password"}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
										placeholder="Enter your password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300"
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</div>{" "}
							{error && (
								<div className="text-red-500 text-sm mt-2">{error}</div>
							)}
							{successMessage && (
								<div className="text-green-500 text-sm mt-2">
									{successMessage}
								</div>
							)}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
							>
								{isLoading ? "Signing you in..." : "Sign In"}
							</button>
						</>
					) : (
						<div>
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-400 mb-2">
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
									<input
										type="email"
										required
										value={resetEmail}
										onChange={(e) => setResetEmail(e.target.value)}
										className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
										placeholder="Enter your email"
									/>
								</div>
							</div>

							{error && (
								<div className="text-red-500 text-sm mb-4">{error}</div>
							)}
							{successMessage && (
								<div className="text-green-500 text-sm mb-4">
									{successMessage}
								</div>
							)}

							<button
								type="submit"
								disabled={isLoading}
								className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? "Sending Reset Link..." : "Reset Password"}
							</button>
						</div>
					)}{" "}
				</form>{" "}
				<div className="mt-6 text-center">
					<button
						type="button"
						onClick={() => {
							setIsResetMode(!isResetMode);
							setError("");
							setSuccessMessage("");
							setResetEmail("");
						}}
						className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
					>
						{isResetMode ? "Back to Login" : "Forgot Password?"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
