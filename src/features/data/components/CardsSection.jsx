import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import CardForm from "./CardForm";
import { Modal } from "../../../components/common";
import SectionTableHeader from "./SectionTableHeader";
import {
	addCardApi,
	getCardListApi,
	updateCardApi,
	deleteCardApi,
	toggleCardStatusApi,
} from "../../../api";
import { useAuth } from "../../../auth/hooks/useAuth";
import { showPromiseToast } from "../../../utils/showPromiseToast";

export default function CardsSection({ onClose }) {
	const { user, token } = useAuth();
	const [cards, setCards] = useState([]);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState("add");
	const [editData, setEditData] = useState(null);

	useEffect(() => {
		setError("");
		showPromiseToast(getCardListApi(user?.email, token), {
			loading: "Loading cards...",
			success: "Cards loaded!",
			error: "Failed to load cards",
		})
			.then(setCards)
			.catch((err) => setError(err.message));
	}, [user, token]);

	const handleAdd = () => {
		setModalType("add");
		setEditData(null);
		setShowModal(true);
	};

	const handleEdit = (item) => {
		setModalType("edit");
		setEditData({
			card: item.name || item.card || "",
			shortName: item.sort_name || item.shortName || "",
			id: item.id,
		});
		setShowModal(true);
	};
	const handleDelete = async (id) => {
		await showPromiseToast(deleteCardApi(id, user?.email, token), {
			loading: "Deleting card...",
			success: "Card deleted successfully!",
			error: "Failed to delete card",
		});
		// Refresh data after delete
		const freshCards = await getCardListApi(user?.email, token);
		setCards(freshCards);
	};
	const handleToggleStatus = async (id) => {
		setCards((prev) =>
			prev.map((c) => (c.id === id ? { ...c, _statusLoading: true } : c))
		);
		await showPromiseToast(toggleCardStatusApi(id), {
			loading: "Toggling status...",
			success: "Status updated!",
			error: "Failed to update status",
		});
		// Refresh data after status toggle
		const freshCards = await getCardListApi(user?.email, token);
		setCards(freshCards);
	};

	const handleFormSubmit = async (formData) => {
		setShowModal(false);
		setEditData(null);
		if (modalType === "add") {
			await showPromiseToast(addCardApi(formData, user?.email, token), {
				loading: "Adding card...",
				success: "Card added!",
				error: "Failed to add card",
			});
			const freshCards = await getCardListApi(user?.email, token);
			setCards(freshCards);
		} else if (modalType === "edit") {
			await showPromiseToast(
				updateCardApi({ id: editData.id, ...formData }, user?.email, token),
				{
					loading: "Updating card...",
					success: "Card updated!",
					error: "Failed to update card",
				}
			);
			const freshCards = await getCardListApi(user?.email, token);
			setCards(freshCards);
		}
	};

	const filteredCards = cards.filter((c) =>
		(c.name || c.card || "").toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<SectionTableHeader
				title="Cards"
				onClose={onClose}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onAdd={handleAdd}
				addLabel="Add Card"
			/>
			{/* {error && <div className="text-red-400 mb-2">{error}</div>} */}
			<DataTable
				data={Array.isArray(filteredCards) ? filteredCards : []}
				onEdit={handleEdit}
				onDelete={handleDelete}
				columns={["name", "sort_name", "status"]}
				loading={false}
				loadingLabel="Loading cards..."
				onToggleStatus={handleToggleStatus}
			/>
			{showModal && (
				<Modal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					title={`${modalType === "add" ? "Add New" : "Edit"} Card`}
					maxWidth="md"
				>
					<CardForm
						initialData={modalType === "edit" ? editData : {}}
						onSubmit={handleFormSubmit}
						onCancel={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</>
	);
}
