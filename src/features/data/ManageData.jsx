// --- DEBUGGING/MAINTENANCE COMMENTS ---
// This file now only handles section selection and rendering. All state, API, and modal logic is managed in each section component.
// ----------------------------------------

// Imports
import { useState } from "react";
import { CreditCard, Briefcase, Globe, Phone } from "lucide-react";
import CurrencySection from "./components/CurrencySection";
import CardsSection from "./components/CardsSection";
import ProvidersSection from "./components/ProvidersSection";
import CallQueueSection from "./components/CallQueueSection";

function ManageData() {
	// UI State: Only section selection is managed here
	const [activeSection, setActiveSection] = useState(null);

	// Section definitions for UI tiles
	const sections = [
		// {
		// 	id: "airlines",
		// 	title: "Airlines",
		// 	color: "from-indigo-500/10 to-indigo-600/10",
		// 	icon: Plane,
		// 	borderColor: "hover:border-indigo-500",
		// 	iconColor: "text-indigo-500/20",
		// },
		{
			id: "currency",
			title: "Currency",
			color: "from-teal-500/10 to-teal-600/10",
			icon: Globe,
			borderColor: "hover:border-teal-500",
			iconColor: "text-teal-500/20",
		},
		{
			id: "cards",
			title: "Cards",
			color: "from-rose-500/10 to-rose-600/10",
			icon: CreditCard,
			borderColor: "hover:border-rose-500",
			iconColor: "text-rose-500/20",
		},
		{
			id: "providers",
			title: "Providers",
			color: "from-amber-500/10 to-amber-600/10",
			icon: Briefcase,
			borderColor: "hover:border-amber-500",
			iconColor: "text-amber-500/20",
		},
		{
			id: "callQueue",
			title: "Call Queue",
			color: "from-green-500/10 to-green-600/10",
			icon: Phone,
			borderColor: "hover:border-green-500",
			iconColor: "text-green-500/20",
		},
	];

	// Render the correct section for the active section
	const renderSection = () => {
		switch (activeSection) {
			case "currency":
				return <CurrencySection onClose={() => setActiveSection(null)} />;
			case "cards":
				return <CardsSection onClose={() => setActiveSection(null)} />;
			case "providers":
				return <ProvidersSection onClose={() => setActiveSection(null)} />;
			case "callQueue":
				return <CallQueueSection onClose={() => setActiveSection(null)} />;
			default:
				return null;
		}
	};

	// Section selection UI
	if (!activeSection) {
		return (
			<div className="max-w-7xl mx-auto p-4">
				<h2 className="text-xl font-semibold text-white mb-6">
					Select Data Type to Manage
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{sections.map(
						({ id, title, color, icon: Icon, borderColor, iconColor }) => (
							<button
								key={id}
								onClick={() => setActiveSection(id)}
								className={`group relative h-32 p-6 rounded-xl bg-gradient-to-br ${color} \
                        backdrop-blur-lg border border-gray-800 \
                        ${borderColor} transition-all duration-200 \
                        shadow-lg hover:shadow-xl overflow-hidden`}
							>
								<h3 className="relative z-10 text-2xl font-semibold text-white group-hover:scale-105 transition-transform">
									{title}
								</h3>
								<Icon
									className={`absolute right-[-15px] bottom-[-20px] w-30 h-30 ${iconColor} transform transition-transform group-hover:scale-120`}
								/>
							</button>
						)
					)}
				</div>
			</div>
		);
	}

	// Main render
	return (
		<div className="max-w-7xl mx-auto space-y-8">
			{activeSection && (
				<div className="rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700">
					{/* Section renders its own data, modal, and logic */}
					<div className="p-6">{renderSection()}</div>
				</div>
			)}
		</div>
	);
}

export default ManageData;
