import React, { createContext, useContext, useEffect, useState } from "react";
import { activeCardsApi } from "../api/card/cardApi";
import { activeCurrencyListApi } from "../api/currency/currencyApi";
import { activeProvidersApi } from "../api/provider/providerApi";
import { activeQueuesApi } from "../api/queue/queueApi";
import { getUserByRoleApi } from "../api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const [cards, setCards] = useState([]);
	const [currencies, setCurrencies] = useState([]);
	const [providers, setProviders] = useState([]);
	const [callQueues, setCallQueues] = useState([]);
	const [leaders, setLeaders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	// Add individual loading states
	const [cardsLoading, setCardsLoading] = useState(false);
	const [currenciesLoading, setCurrenciesLoading] = useState(false);
	const [providersLoading, setProvidersLoading] = useState(false);
	const [callQueuesLoading, setCallQueuesLoading] = useState(false);
	const [leadersLoading, setLeadersLoading] = useState(false);
	// Individual fetch functions
	const fetchCards = async () => {
		setCardsLoading(true);
		try {
			const data = await activeCardsApi();
			setCards(data || []);
		} catch (err) {
			setError(err.message || "Failed to load cards");
		} finally {
			setCardsLoading(false);
		}
	};
	const fetchCurrencies = async () => {
		setCurrenciesLoading(true);
		try {
			const data = await activeCurrencyListApi();
			setCurrencies(data || []);
		} catch (err) {
			setError(err.message || "Failed to load currencies");
		} finally {
			setCurrenciesLoading(false);
		}
	};
	const fetchProviders = async () => {
		setProvidersLoading(true);
		try {
			const data = await activeProvidersApi();
			setProviders(data || []);
		} catch (err) {
			setError(err.message || "Failed to load providers");
		} finally {
			setProvidersLoading(false);
		}
	};
	const fetchCallQueues = async () => {
		setCallQueuesLoading(true);
		try {
			const data = await activeQueuesApi();
			setCallQueues(data || []);
		} catch (err) {
			setError(err.message || "Failed to load call queues");
		} finally {
			setCallQueuesLoading(false);
		}
	};

	const fetchLeaders = async () => {
		setLeadersLoading(true);
		try {
			const data = await getUserByRoleApi(2);
			setLeaders(data || []);
		} catch (err) {
			setError(err.message || "Failed to load leaders");
		} finally {
			setLeadersLoading(false);
		}
	};

	useEffect(() => {
		// Initial fetch for all data
		setLoading(true);
		setError(null);
		Promise.all([
			fetchCards(),
			fetchCurrencies(),
			fetchProviders(),
			fetchCallQueues(),
			fetchLeaders(),
		]).finally(() => setLoading(false));
	}, []);

	return (
		<DataContext.Provider
			value={{
				cards,
				currencies,
				providers,
				callQueues,
				leaders,
				loading,
				error,
				// Expose loading states and fetch functions
				cardsLoading,
				currenciesLoading,
				providersLoading,
				callQueuesLoading,
				leadersLoading,
				fetchCards,
				fetchCurrencies,
				fetchProviders,
				fetchCallQueues,
				fetchLeaders,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useDataContext = () => useContext(DataContext);
