import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
	const navigate = useNavigate();
	const [count, setCount] = useState(3);

	useEffect(() => {
		let timer;
		if (count > 0) {
			timer = setTimeout(() => setCount(count - 1), 1000);
		} else {
			navigate("/", { replace: true });
		}
		return () => clearTimeout(timer);
	}, [count, navigate]);

	return (
		<div className="flex flex-col items-center justify-center h-full py-20">
			<h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
			<p className="text-gray-300 text-lg mb-2">
				You do not have permission to view this page.
			</p>
			<p className="text-gray-400 text-sm">
				Redirecting to home page in{" "}
				<span className="font-semibold text-white">{count}</span> second
				{count !== 1 ? "s" : ""}...
			</p>
		</div>
	);
}
