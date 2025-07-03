import React, { useRef, useEffect, useState } from "react";
import { Plus, X, Eye } from "lucide-react";

function AttachmentsSection({ images, setImages, onPreview }) {
	const fileInputRef = useRef();
	const [processedImages, setProcessedImages] = useState([]);

	useEffect(() => {
		if (images && Array.isArray(images)) {
			const baseRoute = import.meta.env.VITE_UPLOADS_BASE_URL || "";
			const updatedImages = images.map((img) => {
				if (typeof img === "string" && img.startsWith("data:image/")) {
					return img;
				}
				return img.startsWith(baseRoute) ? img : `${baseRoute}${img}`;
			});
			setProcessedImages(updatedImages);
		}
	}, [images]);

	const handleAddImage = (e) => {
		const files = Array.from(e.target.files);
		if (files.length) {
			files.forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					if (
						typeof reader.result === "string" &&
						reader.result.startsWith("data:image/")
					) {
						setImages((prev) => [...prev, reader.result]);
					}
				};
				reader.readAsDataURL(file);
			});
		}
		e.target.value = null;
	};

	const handleRemoveImage = (index) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="p-3 border border-gray-700 rounded-lg mb-4">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-semibold">Attachments</h3>
				<button
					type="button"
					className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
					onClick={() => fileInputRef.current.click()}
				>
					<Plus className="w-4 h-4" />
					Add Image
				</button>
				<input
					type="file"
					accept="image/*"
					multiple
					ref={fileInputRef}
					className="hidden"
					onChange={handleAddImage}
				/>
			</div>
			<div className="flex flex-wrap gap-4">
				{processedImages.map((img, idx) =>
					img && typeof img === "string" ? (
						<div
							key={idx}
							className="relative w-32 h-32 border border-gray-600 rounded overflow-hidden bg-gray-800"
						>
							<img
								src={img}
								alt="Attachment"
								className="object-cover w-full h-full cursor-pointer"
								onClick={() => onPreview && onPreview(img)}
								onError={(e) => {
									e.target.alt = "Invalid image";
									console.warn("Invalid base64 image string:", img);
								}}
							/>
							<div className="absolute top-1 right-1 flex gap-1">
								<button
									type="button"
									className="bg-gray-900 bg-opacity-70 rounded-full p-1 text-blue-400 hover:text-blue-200"
									onClick={() => onPreview && onPreview(img)}
									title="Preview"
								>
									<Eye className="w-4 h-4" />
								</button>
								<button
									type="button"
									className="bg-gray-900 bg-opacity-70 rounded-full p-1 text-red-400 hover:text-red-200"
									onClick={() => handleRemoveImage(idx)}
									title="Remove"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>
					) : null
				)}
				{processedImages.length === 0 && (
					<span className="text-gray-400 text-sm">No attachments added.</span>
				)}
			</div>
		</div>
	);
}

export default AttachmentsSection;
