import { z } from 'zod';
import { baseBookingSchema } from './bookingSchema';

// Create a seat assignment schema
// For seat assignments, we need passenger data and charge data (for seat fees)
// We can omit other fields that might not be needed
export const seatAssignmentSchema = baseBookingSchema.extend({
	// Override image_itinerary with custom error message
	image_itinerary: z
		.array(z.union([z.instanceof(File), z.string()]))
		.min(1, 'at least one image is required'),
});

export default seatAssignmentSchema;
