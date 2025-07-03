import React from "react";

function LoadingSpinner({
	label = "Loading...",
	fullPage = false,
	size = "md",
}) {
	const sizeClass =
		size === "sm"
			? "w-6 h-6 border-2"
			: size === "lg"
			? "w-16 h-16 border-8"
			: "w-12 h-12 border-4";
	const innerSizeClass =
		size === "sm" ? "w-3 h-3" : size === "lg" ? "w-8 h-8" : "w-6 h-6";

	const spinner = (
		<div className={`relative flex items-center justify-center`}>
			<span
				className={`block ${sizeClass} border-blue-500 border-t-transparent rounded-full animate-spin`}
			></span>
			<span
				className={`absolute ${innerSizeClass} bg-blue-500 rounded-full opacity-20`}
			></span>
		</div>
	);

	const labelElem = label ? (
		<span className="mt-4 text-base text-gray-300 font-medium tracking-wide animate-pulse">
			{label}
		</span>
	) : null;

	if (fullPage) {
		return (
			<div className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
				{spinner}
				{labelElem}
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center py-4">
			{spinner}
			{labelElem}
		</div>
	);
}

export default LoadingSpinner;
