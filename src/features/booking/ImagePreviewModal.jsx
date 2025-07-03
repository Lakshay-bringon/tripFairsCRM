import React from "react";
import { Modal } from "../../components/common";

export default function ImagePreviewModal({
	isOpen,
	onClose,
	imageUrl,
	altText = "Preview",
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
			<div className="flex flex-col items-center p-4">
				<img
					src={imageUrl}
					alt={altText}
					className="max-w-full max-h-[80vh] h-auto object-contain rounded"
				/>
			</div>
		</Modal>
	);
}
