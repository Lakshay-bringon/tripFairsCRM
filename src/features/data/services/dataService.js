/**
 * Data Service - Manages currency, cards, providers, and call queue operations
 * This service handles all data management operations including CRUD operations,
 * validation, search, and mock data for development.
 */

// Mock data for development
const mockCurrencies = [
	{
		id: 1,
		name: "US Dollar",
		code: "USD",
		symbol: "$",
		rate: 1.0,
		status: "active",
	},
	{
		id: 2,
		name: "Euro",
		code: "EUR",
		symbol: "€",
		rate: 0.85,
		status: "active",
	},
	{
		id: 3,
		name: "British Pound",
		code: "GBP",
		symbol: "£",
		rate: 0.73,
		status: "active",
	},
	{
		id: 4,
		name: "Japanese Yen",
		code: "JPY",
		symbol: "¥",
		rate: 110.0,
		status: "active",
	},
	{
		id: 5,
		name: "Canadian Dollar",
		code: "CAD",
		symbol: "C$",
		rate: 1.25,
		status: "inactive",
	},
];

const mockCards = [
	{
		id: 1,
		name: "Visa",
		type: "credit",
		logo: "/logos/visa.png",
		status: "active",
		description: "Visa credit card processing",
		createdAt: "2024-01-15",
	},
	{
		id: 2,
		name: "MasterCard",
		type: "credit",
		logo: "/logos/mastercard.png",
		status: "active",
		description: "MasterCard credit card processing",
		createdAt: "2024-01-15",
	},
	{
		id: 3,
		name: "American Express",
		type: "credit",
		logo: "/logos/amex.png",
		status: "active",
		description: "American Express credit card processing",
		createdAt: "2024-01-20",
	},
	{
		id: 4,
		name: "Discover",
		type: "credit",
		logo: "/logos/discover.png",
		status: "inactive",
		description: "Discover credit card processing",
		createdAt: "2024-02-01",
	},
];

const mockProviders = [
	{
		id: 1,
		name: "Air India",
		code: "AI",
		logo: "/logos/airindia.png",
		status: "active",
		description: "National carrier of India",
		website: "https://www.airindia.in",
		createdAt: "2024-01-10",
	},
	{
		id: 2,
		name: "SpiceJet",
		code: "SG",
		logo: "/logos/spicejet.png",
		status: "active",
		description: "Low-cost carrier",
		website: "https://www.spicejet.com",
		createdAt: "2024-01-12",
	},
	{
		id: 3,
		name: "IndiGo",
		code: "6E",
		logo: "/logos/indigo.png",
		status: "active",
		description: "India's largest airline",
		website: "https://www.goindigo.in",
		createdAt: "2024-01-15",
	},
	{
		id: 4,
		name: "Vistara",
		code: "UK",
		logo: "/logos/vistara.png",
		status: "inactive",
		description: "Full-service carrier",
		website: "https://www.airvistara.com",
		createdAt: "2024-02-01",
	},
];

const mockCallQueue = [
	{
		id: 1,
		name: "Customer Support",
		description: "General customer support queue",
		maxWaitTime: 300, // seconds
		priority: "medium",
		status: "active",
		agents: 5,
		currentCalls: 12,
		createdAt: "2024-01-10",
	},
	{
		id: 2,
		name: "Sales",
		description: "Sales and booking inquiries",
		maxWaitTime: 180,
		priority: "high",
		status: "active",
		agents: 8,
		currentCalls: 25,
		createdAt: "2024-01-10",
	},
	{
		id: 3,
		name: "Technical Support",
		description: "Technical assistance queue",
		maxWaitTime: 600,
		priority: "low",
		status: "active",
		agents: 3,
		currentCalls: 5,
		createdAt: "2024-01-15",
	},
	{
		id: 4,
		name: "VIP Support",
		description: "Premium customer support",
		maxWaitTime: 60,
		priority: "urgent",
		status: "inactive",
		agents: 2,
		currentCalls: 0,
		createdAt: "2024-02-01",
	},
];

class DataService {
	constructor() {
		this.currencies = [...mockCurrencies];
		this.cards = [...mockCards];
		this.providers = [...mockProviders];
		this.callQueue = [...mockCallQueue];
		this.nextId = 1000; // Start IDs from 1000 for new items
	}

	// Utility methods
	generateId() {
		return ++this.nextId;
	}

	validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	validateRequired(value, fieldName) {
		if (!value || (typeof value === "string" && value.trim() === "")) {
			throw new Error(`${fieldName} is required`);
		}
	}

	formatResponse(success, data = null, message = "") {
		return {
			success,
			data,
			message,
			timestamp: new Date().toISOString(),
		};
	}

	// Currency Management
	async getCurrencies(options = {}) {
		try {
			const {
				search = "",
				status = "all",
				sortBy = "name",
				sortOrder = "asc",
			} = options;

			let filteredCurrencies = [...this.currencies];

			// Apply search filter
			if (search) {
				filteredCurrencies = filteredCurrencies.filter(
					(currency) =>
						currency.name.toLowerCase().includes(search.toLowerCase()) ||
						currency.code.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply status filter
			if (status !== "all") {
				filteredCurrencies = filteredCurrencies.filter(
					(currency) => currency.status === status
				);
			}

			// Apply sorting
			filteredCurrencies.sort((a, b) => {
				const aVal = a[sortBy];
				const bVal = b[sortBy];
				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortOrder === "asc" ? comparison : -comparison;
			});

			return this.formatResponse(
				true,
				filteredCurrencies,
				"Currencies retrieved successfully"
			);
		} catch (error) {
			throw new Error(`Failed to fetch currencies: ${error.message}`);
		}
	}

	async getCurrencyById(id) {
		try {
			const currency = this.currencies.find((c) => c.id === parseInt(id));
			if (!currency) {
				throw new Error("Currency not found");
			}
			return this.formatResponse(
				true,
				currency,
				"Currency retrieved successfully"
			);
		} catch (error) {
			throw new Error(`Failed to fetch currency: ${error.message}`);
		}
	}

	async createCurrency(currencyData) {
		try {
			this.validateRequired(currencyData.name, "Currency name");
			this.validateRequired(currencyData.code, "Currency code");
			this.validateRequired(currencyData.symbol, "Currency symbol");

			// Check for duplicate code
			const existingCurrency = this.currencies.find(
				(c) => c.code === currencyData.code
			);
			if (existingCurrency) {
				throw new Error("Currency code already exists");
			}

			const newCurrency = {
				id: this.generateId(),
				name: currencyData.name.trim(),
				code: currencyData.code.trim().toUpperCase(),
				symbol: currencyData.symbol.trim(),
				rate: parseFloat(currencyData.rate) || 1.0,
				status: currencyData.status || "active",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			this.currencies.push(newCurrency);
			return this.formatResponse(
				true,
				newCurrency,
				"Currency created successfully"
			);
		} catch (error) {
			throw new Error(`Failed to create currency: ${error.message}`);
		}
	}

	async updateCurrency(id, currencyData) {
		try {
			const currencyIndex = this.currencies.findIndex(
				(c) => c.id === parseInt(id)
			);
			if (currencyIndex === -1) {
				throw new Error("Currency not found");
			}

			this.validateRequired(currencyData.name, "Currency name");
			this.validateRequired(currencyData.code, "Currency code");
			this.validateRequired(currencyData.symbol, "Currency symbol");

			// Check for duplicate code (excluding current currency)
			const existingCurrency = this.currencies.find(
				(c) => c.code === currencyData.code && c.id !== parseInt(id)
			);
			if (existingCurrency) {
				throw new Error("Currency code already exists");
			}

			const updatedCurrency = {
				...this.currencies[currencyIndex],
				name: currencyData.name.trim(),
				code: currencyData.code.trim().toUpperCase(),
				symbol: currencyData.symbol.trim(),
				rate: parseFloat(currencyData.rate) || 1.0,
				status: currencyData.status || "active",
				updatedAt: new Date().toISOString(),
			};

			this.currencies[currencyIndex] = updatedCurrency;
			return this.formatResponse(
				true,
				updatedCurrency,
				"Currency updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to update currency: ${error.message}`);
		}
	}

	async deleteCurrency(id) {
		try {
			const currencyIndex = this.currencies.findIndex(
				(c) => c.id === parseInt(id)
			);
			if (currencyIndex === -1) {
				throw new Error("Currency not found");
			}

			const deletedCurrency = this.currencies.splice(currencyIndex, 1)[0];
			return this.formatResponse(
				true,
				deletedCurrency,
				"Currency deleted successfully"
			);
		} catch (error) {
			throw new Error(`Failed to delete currency: ${error.message}`);
		}
	}

	async toggleCurrencyStatus(id) {
		try {
			const currency = this.currencies.find((c) => c.id === parseInt(id));
			if (!currency) {
				throw new Error("Currency not found");
			}

			currency.status = currency.status === "active" ? "inactive" : "active";
			currency.updatedAt = new Date().toISOString();

			return this.formatResponse(
				true,
				currency,
				"Currency status updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to toggle currency status: ${error.message}`);
		}
	}

	// Card Management
	async getCards(options = {}) {
		try {
			const {
				search = "",
				status = "all",
				type = "all",
				sortBy = "name",
				sortOrder = "asc",
			} = options;

			let filteredCards = [...this.cards];

			// Apply search filter
			if (search) {
				filteredCards = filteredCards.filter(
					(card) =>
						card.name.toLowerCase().includes(search.toLowerCase()) ||
						card.description.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply status filter
			if (status !== "all") {
				filteredCards = filteredCards.filter((card) => card.status === status);
			}

			// Apply type filter
			if (type !== "all") {
				filteredCards = filteredCards.filter((card) => card.type === type);
			}

			// Apply sorting
			filteredCards.sort((a, b) => {
				const aVal = a[sortBy];
				const bVal = b[sortBy];
				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortOrder === "asc" ? comparison : -comparison;
			});

			return this.formatResponse(
				true,
				filteredCards,
				"Cards retrieved successfully"
			);
		} catch (error) {
			throw new Error(`Failed to fetch cards: ${error.message}`);
		}
	}

	async createCard(cardData) {
		try {
			this.validateRequired(cardData.name, "Card name");
			this.validateRequired(cardData.type, "Card type");

			const newCard = {
				id: this.generateId(),
				name: cardData.name.trim(),
				type: cardData.type,
				logo: cardData.logo || "",
				status: cardData.status || "active",
				description: cardData.description || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			this.cards.push(newCard);
			return this.formatResponse(true, newCard, "Card created successfully");
		} catch (error) {
			throw new Error(`Failed to create card: ${error.message}`);
		}
	}

	async updateCard(id, cardData) {
		try {
			const cardIndex = this.cards.findIndex((c) => c.id === parseInt(id));
			if (cardIndex === -1) {
				throw new Error("Card not found");
			}

			this.validateRequired(cardData.name, "Card name");
			this.validateRequired(cardData.type, "Card type");

			const updatedCard = {
				...this.cards[cardIndex],
				name: cardData.name.trim(),
				type: cardData.type,
				logo: cardData.logo || "",
				status: cardData.status || "active",
				description: cardData.description || "",
				updatedAt: new Date().toISOString(),
			};

			this.cards[cardIndex] = updatedCard;
			return this.formatResponse(
				true,
				updatedCard,
				"Card updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to update card: ${error.message}`);
		}
	}

	async deleteCard(id) {
		try {
			const cardIndex = this.cards.findIndex((c) => c.id === parseInt(id));
			if (cardIndex === -1) {
				throw new Error("Card not found");
			}

			const deletedCard = this.cards.splice(cardIndex, 1)[0];
			return this.formatResponse(
				true,
				deletedCard,
				"Card deleted successfully"
			);
		} catch (error) {
			throw new Error(`Failed to delete card: ${error.message}`);
		}
	}

	async toggleCardStatus(id) {
		try {
			const card = this.cards.find((c) => c.id === parseInt(id));
			if (!card) {
				throw new Error("Card not found");
			}

			card.status = card.status === "active" ? "inactive" : "active";
			card.updatedAt = new Date().toISOString();

			return this.formatResponse(
				true,
				card,
				"Card status updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to toggle card status: ${error.message}`);
		}
	}

	// Provider Management
	async getProviders(options = {}) {
		try {
			const {
				search = "",
				status = "all",
				sortBy = "name",
				sortOrder = "asc",
			} = options;

			let filteredProviders = [...this.providers];

			// Apply search filter
			if (search) {
				filteredProviders = filteredProviders.filter(
					(provider) =>
						provider.name.toLowerCase().includes(search.toLowerCase()) ||
						provider.code.toLowerCase().includes(search.toLowerCase()) ||
						provider.description.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply status filter
			if (status !== "all") {
				filteredProviders = filteredProviders.filter(
					(provider) => provider.status === status
				);
			}

			// Apply sorting
			filteredProviders.sort((a, b) => {
				const aVal = a[sortBy];
				const bVal = b[sortBy];
				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortOrder === "asc" ? comparison : -comparison;
			});

			return this.formatResponse(
				true,
				filteredProviders,
				"Providers retrieved successfully"
			);
		} catch (error) {
			throw new Error(`Failed to fetch providers: ${error.message}`);
		}
	}

	async createProvider(providerData) {
		try {
			this.validateRequired(providerData.name, "Provider name");
			this.validateRequired(providerData.code, "Provider code");

			// Check for duplicate code
			const existingProvider = this.providers.find(
				(p) => p.code === providerData.code
			);
			if (existingProvider) {
				throw new Error("Provider code already exists");
			}

			const newProvider = {
				id: this.generateId(),
				name: providerData.name.trim(),
				code: providerData.code.trim().toUpperCase(),
				logo: providerData.logo || "",
				status: providerData.status || "active",
				description: providerData.description || "",
				website: providerData.website || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			this.providers.push(newProvider);
			return this.formatResponse(
				true,
				newProvider,
				"Provider created successfully"
			);
		} catch (error) {
			throw new Error(`Failed to create provider: ${error.message}`);
		}
	}

	async updateProvider(id, providerData) {
		try {
			const providerIndex = this.providers.findIndex(
				(p) => p.id === parseInt(id)
			);
			if (providerIndex === -1) {
				throw new Error("Provider not found");
			}

			this.validateRequired(providerData.name, "Provider name");
			this.validateRequired(providerData.code, "Provider code");

			// Check for duplicate code (excluding current provider)
			const existingProvider = this.providers.find(
				(p) => p.code === providerData.code && p.id !== parseInt(id)
			);
			if (existingProvider) {
				throw new Error("Provider code already exists");
			}

			const updatedProvider = {
				...this.providers[providerIndex],
				name: providerData.name.trim(),
				code: providerData.code.trim().toUpperCase(),
				logo: providerData.logo || "",
				status: providerData.status || "active",
				description: providerData.description || "",
				website: providerData.website || "",
				updatedAt: new Date().toISOString(),
			};

			this.providers[providerIndex] = updatedProvider;
			return this.formatResponse(
				true,
				updatedProvider,
				"Provider updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to update provider: ${error.message}`);
		}
	}

	async deleteProvider(id) {
		try {
			const providerIndex = this.providers.findIndex(
				(p) => p.id === parseInt(id)
			);
			if (providerIndex === -1) {
				throw new Error("Provider not found");
			}

			const deletedProvider = this.providers.splice(providerIndex, 1)[0];
			return this.formatResponse(
				true,
				deletedProvider,
				"Provider deleted successfully"
			);
		} catch (error) {
			throw new Error(`Failed to delete provider: ${error.message}`);
		}
	}

	async toggleProviderStatus(id) {
		try {
			const provider = this.providers.find((p) => p.id === parseInt(id));
			if (!provider) {
				throw new Error("Provider not found");
			}

			provider.status = provider.status === "active" ? "inactive" : "active";
			provider.updatedAt = new Date().toISOString();

			return this.formatResponse(
				true,
				provider,
				"Provider status updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to toggle provider status: ${error.message}`);
		}
	}

	// Call Queue Management
	async getCallQueues(options = {}) {
		try {
			const {
				search = "",
				status = "all",
				priority = "all",
				sortBy = "name",
				sortOrder = "asc",
			} = options;

			let filteredQueues = [...this.callQueue];

			// Apply search filter
			if (search) {
				filteredQueues = filteredQueues.filter(
					(queue) =>
						queue.name.toLowerCase().includes(search.toLowerCase()) ||
						queue.description.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply status filter
			if (status !== "all") {
				filteredQueues = filteredQueues.filter(
					(queue) => queue.status === status
				);
			}

			// Apply priority filter
			if (priority !== "all") {
				filteredQueues = filteredQueues.filter(
					(queue) => queue.priority === priority
				);
			}

			// Apply sorting
			filteredQueues.sort((a, b) => {
				const aVal = a[sortBy];
				const bVal = b[sortBy];
				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortOrder === "asc" ? comparison : -comparison;
			});

			return this.formatResponse(
				true,
				filteredQueues,
				"Call queues retrieved successfully"
			);
		} catch (error) {
			throw new Error(`Failed to fetch call queues: ${error.message}`);
		}
	}

	async createCallQueue(queueData) {
		try {
			this.validateRequired(queueData.name, "Queue name");
			this.validateRequired(queueData.description, "Queue description");

			const newQueue = {
				id: this.generateId(),
				name: queueData.name.trim(),
				description: queueData.description.trim(),
				maxWaitTime: parseInt(queueData.maxWaitTime) || 300,
				priority: queueData.priority || "medium",
				status: queueData.status || "active",
				agents: parseInt(queueData.agents) || 0,
				currentCalls: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			this.callQueue.push(newQueue);
			return this.formatResponse(
				true,
				newQueue,
				"Call queue created successfully"
			);
		} catch (error) {
			throw new Error(`Failed to create call queue: ${error.message}`);
		}
	}

	async updateCallQueue(id, queueData) {
		try {
			const queueIndex = this.callQueue.findIndex((q) => q.id === parseInt(id));
			if (queueIndex === -1) {
				throw new Error("Call queue not found");
			}

			this.validateRequired(queueData.name, "Queue name");
			this.validateRequired(queueData.description, "Queue description");

			const updatedQueue = {
				...this.callQueue[queueIndex],
				name: queueData.name.trim(),
				description: queueData.description.trim(),
				maxWaitTime: parseInt(queueData.maxWaitTime) || 300,
				priority: queueData.priority || "medium",
				status: queueData.status || "active",
				agents: parseInt(queueData.agents) || 0,
				updatedAt: new Date().toISOString(),
			};

			this.callQueue[queueIndex] = updatedQueue;
			return this.formatResponse(
				true,
				updatedQueue,
				"Call queue updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to update call queue: ${error.message}`);
		}
	}

	async deleteCallQueue(id) {
		try {
			const queueIndex = this.callQueue.findIndex((q) => q.id === parseInt(id));
			if (queueIndex === -1) {
				throw new Error("Call queue not found");
			}

			const deletedQueue = this.callQueue.splice(queueIndex, 1)[0];
			return this.formatResponse(
				true,
				deletedQueue,
				"Call queue deleted successfully"
			);
		} catch (error) {
			throw new Error(`Failed to delete call queue: ${error.message}`);
		}
	}

	async toggleCallQueueStatus(id) {
		try {
			const queue = this.callQueue.find((q) => q.id === parseInt(id));
			if (!queue) {
				throw new Error("Call queue not found");
			}

			queue.status = queue.status === "active" ? "inactive" : "active";
			queue.updatedAt = new Date().toISOString();

			return this.formatResponse(
				true,
				queue,
				"Call queue status updated successfully"
			);
		} catch (error) {
			throw new Error(`Failed to toggle call queue status: ${error.message}`);
		}
	}

	// Statistics and reporting
	async getDataStats() {
		try {
			const stats = {
				currencies: {
					total: this.currencies.length,
					active: this.currencies.filter((c) => c.status === "active").length,
					inactive: this.currencies.filter((c) => c.status === "inactive")
						.length,
				},
				cards: {
					total: this.cards.length,
					active: this.cards.filter((c) => c.status === "active").length,
					inactive: this.cards.filter((c) => c.status === "inactive").length,
					byType: {
						credit: this.cards.filter((c) => c.type === "credit").length,
						debit: this.cards.filter((c) => c.type === "debit").length,
					},
				},
				providers: {
					total: this.providers.length,
					active: this.providers.filter((p) => p.status === "active").length,
					inactive: this.providers.filter((p) => p.status === "inactive")
						.length,
				},
				callQueues: {
					total: this.callQueue.length,
					active: this.callQueue.filter((q) => q.status === "active").length,
					inactive: this.callQueue.filter((q) => q.status === "inactive")
						.length,
					totalAgents: this.callQueue.reduce((sum, q) => sum + q.agents, 0),
					totalCalls: this.callQueue.reduce(
						(sum, q) => sum + q.currentCalls,
						0
					),
				},
			};

			return this.formatResponse(
				true,
				stats,
				"Data statistics retrieved successfully"
			);
		} catch (error) {
			throw new Error(`Failed to fetch data statistics: ${error.message}`);
		}
	}

	// Bulk operations
	async bulkUpdateStatus(type, ids, status) {
		try {
			const validTypes = ["currencies", "cards", "providers", "callQueues"];
			if (!validTypes.includes(type)) {
				throw new Error("Invalid type specified");
			}

			const dataArray = this[type === "callQueues" ? "callQueue" : type];
			const updatedItems = [];

			for (const id of ids) {
				const item = dataArray.find((item) => item.id === parseInt(id));
				if (item) {
					item.status = status;
					item.updatedAt = new Date().toISOString();
					updatedItems.push(item);
				}
			}

			return this.formatResponse(
				true,
				updatedItems,
				`Bulk status update completed for ${updatedItems.length} items`
			);
		} catch (error) {
			throw new Error(`Failed to perform bulk update: ${error.message}`);
		}
	}

	// Import/Export functionality
	async exportData(type = "all") {
		try {
			const exportData = {};

			if (type === "all" || type === "currencies") {
				exportData.currencies = this.currencies;
			}
			if (type === "all" || type === "cards") {
				exportData.cards = this.cards;
			}
			if (type === "all" || type === "providers") {
				exportData.providers = this.providers;
			}
			if (type === "all" || type === "callQueues") {
				exportData.callQueues = this.callQueue;
			}

			exportData.exportedAt = new Date().toISOString();
			exportData.version = "1.0";

			return this.formatResponse(
				true,
				exportData,
				"Data exported successfully"
			);
		} catch (error) {
			throw new Error(`Failed to export data: ${error.message}`);
		}
	}
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;
