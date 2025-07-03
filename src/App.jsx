import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { LoginProvider } from "./auth/LoginContext.jsx";
import AppRoutes from "./routes/AppRoutes";

function App() {
	return (
		<AuthProvider>
			<LoginProvider>
				<Router>
					<AppRoutes />
				</Router>
			</LoginProvider>
		</AuthProvider>
	);
}

export default App;
