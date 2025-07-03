import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import CurrencyForm from "./CurrencyForm";
import { Modal } from "../../../components/common";
import SectionTableHeader from "./SectionTableHeader";
import {
	addCurrencyApi,
	getCurrencyListApi,
	updateCurrencyApi,
	deleteCurrencyApi,
	toggleCurrencyStatusApi,
} from "../../../api";
import { showPromiseToast } from "../../../utils/showPromiseToast";

// --- DEBUGGING/MAINTENANCE COMMENTS ---
// CurrencySection handles its own modal and edit state, but all add/edit/delete logic is managed by the parent (ManageData).
// Do not mutate currencies state here on add/edit/delete; only close modal and clear editData on submit.
// All CRUD operations are performed via API in the parent and passed down as props.
// SectionTableHeader is used for consistent header/search/add/close UI.
// To debug: Check that onSubmit in CurrencyForm only closes modal, and that DataTable always receives an array.
// ----------------------------------------

export default function CurrencySection({ onClose }) {
	// State
	const [currencies, setCurrencies] = useState([]);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState("add");
	const [editData, setEditData] = useState(null);

	// Fetch currencies on mount
	useEffect(() => {
		setError("");
		showPromiseToast(getCurrencyListApi(), {
			loading: "Loading currencies...",
			success: "Currencies loaded!",
			error: "Failed to load currencies",
		})
			.then(setCurrencies)
			.catch((err) => setError(err.message));
	}, []);

	// Add
	const handleAdd = () => {
		setModalType("add");
		setEditData(null);
		setShowModal(true);
	};

	// Edit
	const handleEdit = (item) => {
		setModalType("edit");
		setEditData({
			currency: item.currency || item.Currency || "",
			id: item.id,
		});
		setShowModal(true);
	};
	// Delete
	const handleDelete = async (id) => {
		await showPromiseToast(deleteCurrencyApi(id), {
			loading: "Deleting currency...",
			success: "Currency deleted successfully!",
			error: "Failed to delete currency",
		});
		// Refresh data after delete
		const freshCurrencies = await getCurrencyListApi();
		setCurrencies(freshCurrencies);
	};
	// Toggle status
	const handleToggleStatus = async (id) => {
		setCurrencies((prev) =>
			prev.map((c) => (c.id === id ? { ...c, _statusLoading: true } : c))
		);
		await showPromiseToast(toggleCurrencyStatusApi(id), {
			loading: "Toggling status...",
			success: "Status updated!",
			error: "Failed to update status",
		});
		// Refresh data after status toggle
		const freshCurrencies = await getCurrencyListApi();
		setCurrencies(freshCurrencies);
	};
	// Form submit
	const handleFormSubmit = async (formData) => {
		setShowModal(false);
		setEditData(null);
		if (modalType === "add") {
			await showPromiseToast(addCurrencyApi(formData.currency), {
				loading: "Adding currency...",
				success: "Currency added!",
				error: "Failed to add currency",
			});
			// Refresh data after add
			const freshCurrencies = await getCurrencyListApi();
			setCurrencies(freshCurrencies);
		} else if (modalType === "edit") {
			await showPromiseToast(
				updateCurrencyApi({ id: editData.id, currency: formData.currency }),
				{
					loading: "Updating currency...",
					success: "Currency updated!",
					error: "Failed to update currency",
				}
			);
			// Refresh data after edit
			const freshCurrencies = await getCurrencyListApi();
			setCurrencies(freshCurrencies);
		}
	};

	// Filtered data
	const filteredCurrencies = currencies.filter((c) =>
		(c.currency || c.Currency || "")
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<SectionTableHeader
				title="Currency"
				onClose={onClose}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onAdd={handleAdd}
				addLabel="Add Currency"
			/>
			{error && <div className="text-red-400 mb-2">{error}</div>}
			<DataTable
				data={Array.isArray(filteredCurrencies) ? filteredCurrencies : []}
				onEdit={handleEdit}
				onDelete={handleDelete}
				columns={["Currency", "status"]}
				loading={false}
				loadingLabel="Loading currencies..."
				onToggleStatus={handleToggleStatus}
			/>
			{showModal && (
				<Modal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					title={`${modalType === "add" ? "Add New" : "Edit"} Currency`}
					maxWidth="md"
				>
					<CurrencyForm
						initialData={modalType === "edit" ? editData : {}}
						onSubmit={handleFormSubmit}
						onCancel={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</>
	);
}
