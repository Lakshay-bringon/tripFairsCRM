// --- DEBUGGING/MAINTENANCE COMMENTS ---
// ProvidersSection handles its own modal and edit state, but all add/edit/delete logic is managed by the parent (ManageData).
// Do not mutate providers state here on add/edit/delete; only close modal and clear editData on submit.
// All CRUD operations are performed via API in the parent and passed down as props.
// SectionTableHeader is used for consistent header/search/add/close UI.
// To debug: Check that onSubmit in ProviderForm only closes modal, and that DataTable always receives an array.
// ----------------------------------------

import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import ProviderForm from "./ProviderForm";
import { Modal } from "../../../components/common";
import SectionTableHeader from "./SectionTableHeader";
import {
	addProviderApi,
	getProvidersApi,
	updateProviderApi,
	deleteProviderApi,
	toggleProviderStatusApi,
} from "../../../api";
import { showPromiseToast } from "../../../utils/showPromiseToast";

export default function ProvidersSection({ onClose }) {
	const [providers, setProviders] = useState([]);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState("add");
	const [editData, setEditData] = useState(null);

	useEffect(() => {
		setError("");
		showPromiseToast(getProvidersApi(), {
			loading: "Loading providers...",
			success: "Providers loaded!",
			error: "Failed to load providers",
		})
			.then(setProviders)
			.catch((err) => setError(err.message));
	}, []);

	const handleAdd = () => {
		setModalType("add");
		setEditData(null);
		setShowModal(true);
	};

	const handleEdit = (item) => {
		setModalType("edit");
		setEditData(item);
		setShowModal(true);
	};
	const handleDelete = async (id) => {
		await showPromiseToast(deleteProviderApi(id), {
			loading: "Deleting provider...",
			success: "Provider deleted successfully!",
			error: "Failed to delete provider",
		});
		// Refresh data after delete
		const freshProviders = await getProvidersApi();
		setProviders(freshProviders);
	};
	const handleToggleStatus = async (id) => {
		setProviders((prev) =>
			prev.map((p) => (p.id === id ? { ...p, _statusLoading: true } : p))
		);
		await showPromiseToast(toggleProviderStatusApi(id), {
			loading: "Toggling status...",
			success: "Status updated!",
			error: "Failed to update status",
		});
		// Refresh data after status toggle
		const freshProviders = await getProvidersApi();
		setProviders(freshProviders);
	};
	const handleFormSubmit = async (formData) => {
		setShowModal(false);
		setEditData(null);
		if (modalType === "add") {
			await showPromiseToast(addProviderApi(formData), {
				loading: "Adding provider...",
				success: "Provider added!",
				error: "Failed to add provider",
			});
			// Refresh data after add
			const freshProviders = await getProvidersApi();
			setProviders(freshProviders);
		} else if (modalType === "edit") {
			await showPromiseToast(
				updateProviderApi({ ...formData, providerId: editData.id }),
				{
					loading: "Updating provider...",
					success: "Provider updated!",
					error: "Failed to update provider",
				}
			);
			// Refresh data after edit
			const freshProviders = await getProvidersApi();
			setProviders(freshProviders);
		}
	};

	const filteredProviders = providers.filter((p) =>
		(p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<SectionTableHeader
				title="Providers"
				onClose={onClose}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onAdd={handleAdd}
				addLabel="Add Provider"
			/>
			{error && <div className="text-red-400 mb-2">{error}</div>}
			<DataTable
				data={Array.isArray(filteredProviders) ? filteredProviders : []}
				onEdit={handleEdit}
				onDelete={handleDelete}
				columns={["name", "logo", "status"]}
				loading={false}
				loadingLabel="Loading providers..."
				onToggleStatus={handleToggleStatus}
			/>
			{showModal && (
				<Modal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					title={`${modalType === "add" ? "Add New" : "Edit"} Provider`}
					maxWidth="md"
				>
					<ProviderForm
						initialData={modalType === "edit" ? editData : {}}
						onSubmit={handleFormSubmit}
						onCancel={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</>
	);
}
