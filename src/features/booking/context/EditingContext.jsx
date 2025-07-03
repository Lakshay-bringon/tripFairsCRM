import React, { createContext, useContext, useState, useCallback } from "react";

const EditingContext = createContext();

export const useEditingContext = () => {
	const context = useContext(EditingContext);
	if (!context) {
		throw new Error("useEditingContext must be used within an EditingProvider");
	}
	return context;
};

export const EditingProvider = ({ children }) => {
	const [editingSections, setEditingSections] = useState(new Set());

	const startEditing = useCallback((sectionId) => {
		setEditingSections((prev) => new Set([...prev, sectionId]));
	}, []);

	const stopEditing = useCallback((sectionId) => {
		setEditingSections((prev) => {
			const newSet = new Set(prev);
			newSet.delete(sectionId);
			return newSet;
		});
	}, []);

	const isAnySectionEditing = editingSections.size > 0;

	const value = {
		startEditing,
		stopEditing,
		isAnySectionEditing,
		editingSections,
	};

	return (
		<EditingContext.Provider value={value}>{children}</EditingContext.Provider>
	);
};
