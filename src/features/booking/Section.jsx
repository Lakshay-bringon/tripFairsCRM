// Section: Reusable details section for Booking (Provider, Price, etc.)
// - Shows Save/Cancel in header when editing
// - Passes isEditing and setIsEditing to children (render prop)
// - Accepts editableFields (array of field names that can be edited)
// - Accepts onEditStart, onEditCancel, onEditSave, disabledWhileEditing
// Usage:
// <Section title="Provider" editable editableFields={["name"]}>
//   {(isEditing, setIsEditing) => <YourForm isEditing={isEditing} editableFields={["name"]} />}
// </Section>

import { PenSquare } from 'lucide-react';
import React, { useState } from 'react';

export default function Section({
	title,
	editable = false,
	editableFields = [],
	onEditStart,
	onEditCancel,
	onEditSave,
	onSave,
	disabledWhileEditing = false,
	children,
}) {
	const [isEditing, setIsEditing] = useState(false);

	const handleEditClick = () => {
		setIsEditing(true);
		if (onEditStart) onEditStart();
	};
	const handleSaveClick = async () => {
		try {
			// Call the onSave function if provided (for API calls)
			if (onSave) {
				await onSave();
			}

			setIsEditing(false);
			if (onEditSave) onEditSave();
		} catch (error) {
			// console.error('Error saving:', error);
			// Keep editing mode active if save fails
		}
	};
	const handleCancelClick = () => {
		setIsEditing(false);
		if (onEditCancel) onEditCancel();
	};

	return (
		<div
			className={`bg-gray-800 rounded-lg shadow-lg border transition-colors duration-200 ${
				isEditing ? 'border-blue-500' : 'border-gray-700'
			}`}
		>
			<div className="flex justify-between items-center h-12 px-4 border-b border-gray-700">
				<h2 className="text-base font-semibold text-white">{title}</h2>
				{editable &&
					(isEditing ? (
						<div className="flex gap-2">
							<button
								className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition-colors duration-200 text-sm flex items-center"
								onClick={handleSaveClick}
							>
								Save
							</button>
							<button
								className="bg-gray-600 text-white px-4 py-1.5 rounded hover:bg-gray-500 transition-colors duration-200 text-sm flex items-center"
								onClick={handleCancelClick}
							>
								Cancel
							</button>
						</div>
					) : (
						<button
							className="p-1.5 hover:bg-gray-600 rounded text-blue-400 transition-colors duration-200"
							onClick={handleEditClick}
						>
							<PenSquare className="w-4 h-4" />
						</button>
					))}
			</div>
			<div className="border-t border-gray-700">
				{/* Children as function: children(isEditing, setIsEditing, editableFields) */}
				{typeof children === 'function'
					? children(isEditing, setIsEditing, editableFields)
					: children}
			</div>
		</div>
	);
}
