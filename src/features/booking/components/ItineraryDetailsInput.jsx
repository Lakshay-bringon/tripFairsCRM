import React, { useRef, useState, useEffect } from 'react';
import { CloudUpload, Trash, Plus } from 'lucide-react';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export default function ItineraryDetailsInput({
	images = [],
	setImages,
	onImageClick,
	heading = 'Itinerary Details',
	register,
	trigger,
	setValue,
}) {
	const fileInputRef = useRef(null);
	const [previews, setPreviews] = useState([]);

	useEffect(() => {
		const newPreviews = images
			.map((img) => {
				if (typeof img === 'string') {
					// existing uploaded image (string URL)
					const baseRoute = import.meta.env.VITE_UPLOADS_BASE_URL || '';
					return img.startsWith(baseRoute) ? img : `${baseRoute}${img}`;
				} else if (img instanceof File) {
					return URL.createObjectURL(img);
				}
				return null;
			})
			.filter(Boolean);

		setPreviews(newPreviews);

		// Clean up object URLs on unmount
		return () => {
			newPreviews.forEach((preview) => {
				if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
			});
		};
	}, [images]);

	// Helper to format file size
	const formatFileSize = (size) => {
		if (!size && size !== 0) return '';
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(2)} MB`;
	};

	const MAX_IMAGES = 10;
	const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB

	// Calculate total file size
	const totalFileSize = images
		.filter((img) => img instanceof File)
		.reduce((sum, file) => sum + (file.size || 0), 0);

	const canAddImages = (newFiles = []) => {
		const currentCount = images.length;
		const newCount = newFiles.length;
		if (currentCount + newCount > MAX_IMAGES) {
			toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
			return false;
		}
		const newTotalSize =
			images
				.filter((img) => img instanceof File)
				.reduce((sum, file) => sum + (file.size || 0), 0) +
			newFiles
				.filter((f) => f instanceof File)
				.reduce((sum, file) => sum + (file.size || 0), 0);
		if (newTotalSize > MAX_TOTAL_SIZE) {
			toast.error(`Total image size cannot exceed 30MB.`);
			return false;
		}
		return true;
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		const validImages = files.filter(Boolean);
		if (!canAddImages(validImages)) return;
		const newImages = [...images, ...validImages];
		setImages && setImages(newImages);
		if (setValue) {
			setValue('image_itinerary', newImages);
			trigger && trigger('image_itinerary');
		}
		// Reset the input so the same file can be picked again if needed
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleImageRemove = (index) => {
		if (images[index] instanceof File && previews[index]?.startsWith('blob:')) {
			URL.revokeObjectURL(previews[index]);
		}

		const newImages = images.filter((_, i) => i !== index);
		setImages && setImages(newImages);

		if (setValue) {
			setValue('image_itinerary', newImages);
			trigger && trigger('image_itinerary');
		}

		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleDrop = (e) => {
		e.preventDefault();
		const files = Array.from(e.dataTransfer.files).filter((file) =>
			file.type.startsWith('image/')
		);
		const validImages = files.filter(Boolean);
		if (!canAddImages(validImages)) return;
		const newImages = [...images, ...validImages];
		setImages && setImages(newImages);
		if (setValue) {
			setValue('image_itinerary', newImages);
			trigger && trigger('image_itinerary');
		}
	};

	const handleDragOver = (e) => e.preventDefault();

	// Handle paste from clipboard
	const handlePaste = useCallback(
		(e) => {
			// console.log("handle paste called")
			const items = e.clipboardData?.items;
			if (!items) return;

			const imageFiles = Array.from(items)
				.filter((item) => item.type.startsWith('image/'))
				.map((item) => item.getAsFile())
				.filter(Boolean); // remove nulls

			if (imageFiles.length === 0) return;
			if (!canAddImages(imageFiles)) return;
			const newImages = [...images, ...imageFiles];
			setImages && setImages(newImages);
			if (setValue) {
				setValue('image_itinerary', newImages);
				trigger && trigger('image_itinerary');
			}
		},
		[images, setImages, setValue, trigger]
	);

	// Attach global paste listener so paste works even if container isn't focused
	useEffect(() => {
		const onGlobalPaste = (e) => handlePaste(e);
		window.addEventListener('paste', onGlobalPaste);
		return () => window.removeEventListener('paste', onGlobalPaste);
	}, [handlePaste]);

	const handleAddImageClick = () => {
		fileInputRef.current && fileInputRef.current.click();
	};

	return (
		<div className="p-3 border border-gray-700 rounded-lg mb-6">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-semibold">{heading}</h3>
				<button
					type="button"
					onClick={handleAddImageClick}
					className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Add Image
				</button>
			</div>

			{/* Total file size display */}
			{totalFileSize > 0 && (
				<div className="mb-2 text-xs text-gray-400">
					Total size: {formatFileSize(totalFileSize)}
				</div>
			)}

			{/* Image previews */}
			{previews.length > 0 && (
				<div className="space-y-2 mb-4">
					{previews.map((preview, index) => (
						<div
							key={index}
							className="flex items-center justify-between bg-gray-700 text-white px-3 py-2 rounded mb-2"
						>
							<div
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									if (preview) {
										onImageClick(preview);
									}
								}}
								className="flex items-center space-x-4 w-full overflow-hidden cursor-pointer"
							>
								<img
									src={preview}
									alt={`${heading} ${index + 1}`}
									className="w-12 h-12 object-cover rounded"
								/>
								<div className="flex flex-col min-w-0">
									<p className="truncate">
										{heading.split(' ')[0]} Image {index + 1}
									</p>
									{images[index] instanceof File && (
										<span className="text-xs text-gray-400">
											{formatFileSize(images[index].size)}
										</span>
									)}
								</div>
							</div>
							<button
								type="button"
								onClick={() => handleImageRemove(index)}
								className="ml-4"
							>
								<Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
							</button>
						</div>
					))}
				</div>
			)}
			{/* Drop zone - always visible */}
			<div
				className="border-dashed border-2 border-gray-400 p-6 text-center rounded cursor-pointer hover:border-blue-400 transition-colors"
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onPaste={handlePaste}
				tabIndex={0}
				onClick={handleAddImageClick}
				id="image-itinerary-dropzone"
			>
				<p className="text-gray-400 flex flex-col items-center justify-center">
					<CloudUpload className="w-10 h-10 mb-2" />
					Drag and drop, click to select, or paste images here
				</p>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					multiple
					onChange={handleImageUpload}
					className="hidden"
				/>
				{/* Hidden input for form registration */}
				{/* <input
					{...register('image_itinerary')}
					type="hidden"
					value={JSON.stringify(images)}
				/> */}
			</div>
		</div>
	);
}
