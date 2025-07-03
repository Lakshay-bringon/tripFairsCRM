import { z } from 'zod';
import { baseBookingSchema } from './bookingSchema';

// Create an upgrade schema
// For upgrades, we need all standard booking fields
// But might want to modify certain validation requirements
export const upgradeSchema = baseBookingSchema.extend({
	// Override image_itinerary with custom error message
	image_itinerary: z
		.array(z.union([z.instanceof(File), z.string()]))
		.min(1, 'at least one image is required'),
	// We could add upgrade-specific fields or modify existing validation rules if needed
	// For example, making fare_class required for upgrades:
	initial_class: z.string().min(1, 'initial class is required for upgrades'),
	upgraded_class: z.string().min(1, 'upgraded class is required for upgrades'),
});

export default upgradeSchema;
