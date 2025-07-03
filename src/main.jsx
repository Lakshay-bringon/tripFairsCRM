import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<AuthProvider>
		<DataProvider>
			<Toaster
				reverseOrder={false}
				toastOptions={{
					className: "bg-gray-800 text-white",
					style: {
						borderRadius: "8px",
						backgroundColor: "#1f2937",
						color: "#fff",
					},
				}}
			/>
			<App />
		</DataProvider>
	</AuthProvider>
	// </StrictMode>
);
