import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import CallQueueForm from "./CallQueueForm";
import { Modal } from "../../../components/common";
import SectionTableHeader from "./SectionTableHeader";
import {
	addQueueApi,
	updateQueueApi,
	deleteQueueApi,
	toggleQueueStatusApi,
	getQueueListApi,
} from "../../../api";
import { showPromiseToast } from "../../../utils/showPromiseToast";

export default function CallQueueSection({ onClose }) {
	const [callQueues, setCallQueues] = useState([]);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState("add");
	const [editData, setEditData] = useState(null);

	useEffect(() => {
		setError("");
		showPromiseToast(getQueueListApi(), {
			loading: "Loading call queues...",
			success: "Call queues loaded!",
			error: "Failed to load call queues",
		})
			.then(setCallQueues)
			.catch((err) => setError(err.message));
	}, []);

	const handleAdd = () => {
		setModalType("add");
		setEditData(null);
		setShowModal(true);
	};

	const handleEdit = (item) => {
		setModalType("edit");
		// Ensure correct mapping for form fields
		setEditData({
			name: item.name || "",
			phone: item.phone || item.telephone || item.number || "",
			id: item.id,
		});
		setShowModal(true);
	};
	const handleDelete = async (id) => {
		await showPromiseToast(deleteQueueApi(id), {
			loading: "Deleting call queue...",
			success: "Call queue deleted successfully!",
			error: "Failed to delete call queue",
		});
		// Refresh data after delete
		const freshQueues = await getQueueListApi();
		setCallQueues(freshQueues);
	};
	const handleToggleStatus = async (id) => {
		setCallQueues((prev) =>
			prev.map((q) => (q.id === id ? { ...q, _statusLoading: true } : q))
		);
		await showPromiseToast(toggleQueueStatusApi(id), {
			loading: "Toggling status...",
			success: "Status updated!",
			error: "Failed to update status",
		});
		// Refresh data after status toggle
		const freshQueues = await getQueueListApi();
		setCallQueues(freshQueues);
	};
	const handleFormSubmit = async (formData) => {
		setShowModal(false);
		setEditData(null);
		if (modalType === "add") {
			await showPromiseToast(addQueueApi(formData.name, formData.phone), {
				loading: "Adding call queue...",
				success: "Call queue added!",
				error: "Failed to add call queue",
			});
			// Refresh data after add
			const freshQueues = await getQueueListApi();
			setCallQueues(freshQueues);
		} else if (modalType === "edit") {
			await showPromiseToast(
				updateQueueApi({
					id: editData.id,
					queue: formData.name,
					number: formData.phone,
				}),
				{
					loading: "Updating call queue...",
					success: "Call queue updated!",
					error: "Failed to update call queue",
				}
			);
			// Refresh data after edit
			const freshQueues = await getQueueListApi();
			setCallQueues(freshQueues);
		}
	};

	const filteredQueues = callQueues.filter((q) =>
		(q.name || "").toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<SectionTableHeader
				title="Call Queue"
				onClose={onClose}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onAdd={handleAdd}
				addLabel="Add Call Queue"
			/>
			{error && <div className="text-red-400 mb-2">{error}</div>}
			<DataTable
				data={Array.isArray(filteredQueues) ? filteredQueues : []}
				onEdit={handleEdit}
				onDelete={handleDelete}
				columns={["name", "phone", "status"]}
				loading={false}
				loadingLabel="Loading call queues..."
				onToggleStatus={handleToggleStatus}
			/>
			{showModal && (
				<Modal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					title={`${modalType === "add" ? "Add New" : "Edit"} Call Queue`}
					maxWidth="md"
				>
					<CallQueueForm
						initialData={modalType === "edit" ? editData : {}}
						onSubmit={handleFormSubmit}
						onCancel={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</>
	);
}
