import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import ImagePreviewModal from '../ImagePreviewModal.jsx';
import { useDataContext } from '../../../context/DataContext.jsx';
import { showPromiseToast } from '../../../utils/showPromiseToast.js';
import {
	createReservationApi,
	updateBookingApi,
	createReservationApiFormData,
	updateBookingApiFormData,
} from '../../../api/booking/bookingApi.js';
import { bookingSchema } from '../schemas/bookingSchema.js';
import toast from 'react-hot-toast';
import { useAuth } from '../../../auth/hooks/useAuth.jsx';
import { formatESTDateForInput } from '../../../utils/formatters.js';

function BookingComponent({
	children,
	defaultValues,
	onRefresh,
	onBack,
	type = 'NEW BOOKING',
	loadingMessage = 'Processing...',
	successMessage = 'Processed successfully!',
	errorMessage = 'Processing failed',
	schema = bookingSchema, // Use the base bookingSchema as default
	isEditMode = false,
}) {
	const { currencies, cards, fetchCurrencies, fetchCards } = useDataContext();
	const location = useLocation();
	const { transactionType, providerId, queueId } = location.state || {};
	const navigate = useNavigate();
	const { user } = useAuth();
	React.useEffect(() => {
		fetchCards();
		fetchCurrencies();
	}, []); // Transform backend data to match frontend form field names
	const formDefaultValues = React.useMemo(() => {
		if (!defaultValues) return null;

		return defaultValues;
	}, [defaultValues]);
	// State management
	const [itineraryImages, setItineraryImages] = useState([]);
	const [showPreview, setShowPreview] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);
	const [attachments, setAttachments] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currency, setCurrency] = useState('USD'); // Form setup
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		trigger,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema), // Use the passed schema instead of hardcoding bookingSchema
		defaultValues: {
			pnr: '',
			customer_name: '',
			amount: '',
			cancellation_refund_amount: '', // Add the new field for refund components
			future_credit_amount: '', // Add the new field for future credit components
			rebooking_penalty: '', // Add the new field for future credit rebooking penalty
			card_number: '', // Fixed: was cardNumber
			airline_name: '',
			purchase_date: formatESTDateForInput(),
			email: '',
			phone: '',
			card_holder: '',
			payment_method: '',
			billing_address: '',
			city: '',
			state: '',
			zip: '',
			country: '',
			passenger_data: [
				{
					type: '',
					firstName: '',
					middleName: '',
					lastName: '',
					dob: '',
				},
			],
			charge_data: [
				{
					amount: '',
					currency: '',
					description: '',
				},
				{
					amount: '',
					currency: '',
					description: '',
				},
			],
			image_itinerary: [], // Fixed: was itinerary_details
			attachments: [],
		},
	});
	// Initialize state from form default values when available
	React.useEffect(() => {
		if (formDefaultValues) {
			reset(formDefaultValues);
			setAttachments(formDefaultValues.attachments || []); // Handle itinerary images - check both possible field names
			const itineraryData =
				formDefaultValues.image_itinerary ||
				formDefaultValues.itinerary_details;
			if (itineraryData) {
				// Handle both array and single image formats
				if (Array.isArray(itineraryData)) {
					setItineraryImages(itineraryData);
				} else {
					setItineraryImages([itineraryData]);
				}
			} else {
				setItineraryImages([]);
			}

			if (formDefaultValues.currency) {
				setCurrency(formDefaultValues.currency);
			}
		} else {
			reset({
				pnr: '',
				customer_name: '',
				amount: '',
				card_number: '', // Fixed: was cardNumber
				airline_name: '',
				purchase_date: formatESTDateForInput(),
				email: '',
				phone: '',
				card_holder: '',
				payment_method: '',
				billing_address: '',
				city: '',
				state: '',
				zip: '',
				country: '',
				passenger_data: [
					{ type: '', firstName: '', middleName: '', lastName: '', dob: '' },
				],
				charge_data: [
					{ amount: '', currency: '', description: '' },
					{ amount: '', currency: '', description: '' },
				],
				image_itinerary: [], // Fixed: was itinerary_details
				attachments: [],
			});
			setItineraryImages([]);
			setAttachments([]);
			setCurrency('USD');
		}
	}, [formDefaultValues, reset]);

	// Passenger management
	const addPassenger = () => {
		const currentPassengers = watch('passenger_data') || [];
		setValue('passenger_data', [
			...currentPassengers,
			{
				type: '',
				firstName: '',
				middleName: '',
				lastName: '',
				dob: '',
			},
		]);
	};

	const removePassenger = (index) => {
		const currentPassengers = watch('passenger_data') || [];
		if (currentPassengers.length > 1) {
			const newPassengers = currentPassengers.filter((_, i) => i !== index);
			setValue('passenger_data', newPassengers);
		}
	};

	// Charge management
	const addCharge = () => {
		const currentCharges = watch('charge_data') || [];
		setValue('charge_data', [
			...currentCharges,
			{
				amount: '',
				currency: '',
				description: '',
			},
		]);
	};

	const removeCharge = (index) => {
		const currentCharges = watch('charge_data') || [];
		if (currentCharges.length > 1) {
			const newCharges = currentCharges.filter((_, i) => i !== index);
			setValue('charge_data', newCharges);
		}
	}; // Form submission
	const onSubmit = async (data) => {
		if (!user) {
			toast.error(
				`You must be logged in to ${isEditMode ? 'update' : 'create'} a ${type}`
			);
			return;
		}

		setIsSubmitting(true);
		try {
			// For itinerary: process array of images
			const processedItinerary = (itineraryImages || []).map((img) =>
				typeof img === 'string' && img.startsWith('data:image/') ? img : img
			);

			// For attachments: map each image to base64 if new, or filename if unchanged
			const processedAttachments = (attachments || []).map((img) =>
				typeof img === 'string' && img.startsWith('data:image/') ? img : img
			);

			// console.log(data);

			if (isEditMode) {
				const {
					attachments: _,
					itinerary_details: __,
					...cleanBookingData
				} = data;
				const updateData = {
					bid: defaultValues?.bid || defaultValues?.bid,
					userId: user.id,
					email: data.email,
					cchName: data.card_holder,
					billingPhone: data.phone,
					itinerary: processedItinerary,
					attachments: processedAttachments,
					bookingData: { ...cleanBookingData, currency: currency },
				};
				await showPromiseToast(updateBookingApiFormData(updateData), {
					loading: loadingMessage,
					success: successMessage,
					error: (err) => {
						// console.error('Update booking error:', err);
						setIsSubmitting(false);
						return err.message || errorMessage;
					},
				})
					.then((response) => {
						setIsSubmitting(false);
						if (response) {
							onRefresh?.();
						}
					})
					.catch((error) => {
						// console.error('Promise toast error:', error);
						setIsSubmitting(false);
					});
			} else {
				const {
					attachments: _,
					itinerary_details: __,
					...cleanBookingData
				} = data;
				const completeData = {
					transactionType,
					userId: user.id,
					providerId,
					queueId,
					email: data.email,
					cchName: data.card_holder,
					billingPhone: data.phone,
					itinerary: processedItinerary,
					attachments: processedAttachments,
					bookingData: { ...cleanBookingData, currency: currency },
				};
				showPromiseToast(createReservationApiFormData(completeData), {
					loading: loadingMessage,
					success: successMessage,
					error: (err) => {
						// console.error('Create booking error:', err);
						setIsSubmitting(false);
						return err.message || errorMessage;
					},
				})
					.then((response) => {
						if (response) {
							navigate(`/find-bookings/${response?.bidId}`);
						}
					})
					.catch((error) => {
						// console.error('Promise toast error:', error);
						setIsSubmitting(false);
					});
			}
		} catch (error) {
			// console.error(
			// 	`Error ${isEditMode ? 'updating' : 'creating'} ${type}:`,
			// 	error
			// );
			if (error.message && error.message.includes('Validation errors:')) {
				toast.error(error.message);
			} else if (error.message) {
				toast.error(error.message);
			} else {
				toast.error(`Failed to ${isEditMode ? 'update' : 'create'} ${type}`);
			}
			setIsSubmitting(false);
		}
	};

	// Show only the first error and focus on that field
	const showAllErrors = (errors) => {
		// Helper function to flatten nested errors and get the first one
		const getFirstError = (errorsObj, parentPath = '') => {
			for (const [key, value] of Object.entries(errorsObj)) {
				const currentPath = parentPath ? `${parentPath}.${key}` : key;

				// If this is a direct error with message
				if (value?.message) {
					return {
						fieldName: currentPath,
						message: value.message,
						ref: value.ref,
					};
				}

				// If this is an array of errors
				if (Array.isArray(value)) {
					for (let i = 0; i < value.length; i++) {
						const arrayItem = value[i];
						if (arrayItem && typeof arrayItem === 'object') {
							const arrayPath = `${currentPath}.${i}`;
							const nestedError = getFirstError(arrayItem, arrayPath);
							if (nestedError) {
								return nestedError;
							}
						}
					}
				}

				// If this is a nested object
				if (value && typeof value === 'object' && !value.message) {
					const nestedError = getFirstError(value, currentPath);
					if (nestedError) {
						return nestedError;
					}
				}
			}
			return null;
		};

		const firstError = getFirstError(errors);

		if (!firstError) return;

		// Show the first error as toast
		toast.error(firstError.message);

		// Scroll to and focus the field with error
		setTimeout(() => {
			let field = null;

			// Try different strategies to find the field
			if (firstError.ref) {
				// Use the ref if available
				field = firstError.ref;
			} else if (firstError.fieldName === 'image_itinerary') {
				// Special case for itinerary drop zone
				field = document.getElementById('image-itinerary-dropzone');
			} else if (/^passenger_data\.\d+\.dob$/.test(firstError.fieldName)) {
				// Special case for passenger DOB field
				const match = firstError.fieldName.match(
					/^passenger_data\.(\d+)\.dob$/
				);
				if (match) {
					const idx = match[1];
					// Try to find the DatePicker input for this passenger
					field = document.querySelector(
						`[name="dob"]:nth-of-type(${parseInt(idx, 10) + 1})`
					);
					// Fallback: try to find by placeholder and index
					if (!field) {
						const allDobs = Array.from(
							document.querySelectorAll('input[placeholder="MM/DD/YYYY"]')
						);
						field = allDobs[parseInt(idx, 10)] || null;
					}
				}
			} else {
				// Try to find by name attribute (for array fields like charge_data.0.amount)
				field = document.querySelector(`[name="${firstError.fieldName}"]`);

				if (!field) {
					// Try simpler name patterns
					const simpleName = firstError.fieldName.replace(/\.\d+\./g, '.');
					field = document.querySelector(`[name="${simpleName}"]`);
				}

				if (!field) {
					// Try to find the first field that contains part of the field name
					const fieldNameParts = firstError.fieldName.split('.');
					for (const part of fieldNameParts) {
						field = document.querySelector(`[name*="${part}"]`);
						if (field) break;
					}
				}
			}

			if (field) {
				// Scroll the field into view
				field.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});

				// Focus the field if possible
				if (typeof field.focus === 'function') field.focus();

				// Add a temporary highlight effect
				field.style.outline = '2px solid #ef4444';
				field.style.outlineOffset = '2px';

				// Remove highlight after 3 seconds
				setTimeout(() => {
					field.style.outline = '';
					field.style.outlineOffset = '';
				}, 3000);
			} else {
				// console.log(`Could not find field for: ${firstError.fieldName}`);
			}
		}, 100); // Small delay to ensure DOM is ready
	};

	const onInvalid = (formErrors) => {
		showAllErrors(formErrors);
	}; // Create props to pass to the children
	const childrenProps = {
		trigger,
		register,
		handleSubmit,
		watch,
		setValue,
		errors,
		onSubmit,
		onInvalid,
		isSubmitting,
		currencies,
		currency,
		setCurrency,
		itineraryImages,
		setItineraryImages,
		showPreview,
		setShowPreview,
		previewImage,
		setPreviewImage,
		attachments,
		setAttachments,
		addPassenger,
		removePassenger,
		addCharge,
		removeCharge,
		onBack,
		isEditMode,
		type,
		hidePurchaseSummary: formDefaultValues?.hidePurchaseSummary || false,
	}; // Render the wrapper with children components
	return (
		<div className="space-y-4" data-form-section="true">
			<div className="mb-4 p-3 rounded-xl bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700 shadow-xl">
				{React.Children.map(children, (child) =>
					React.cloneElement(child, { ...childrenProps })
				)}

				{showPreview && (
					<ImagePreviewModal
						isOpen={showPreview}
						onClose={() => setShowPreview(false)}
						imageUrl={previewImage}
					/>
				)}
			</div>
		</div>
	);
}

export default BookingComponent;
