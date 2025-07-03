import { z } from "zod";
import { baseBookingSchema } from "./bookingSchema";

// Create an exchange schema that omits passenger_data
export const exchangeSchema = baseBookingSchema.extend({
	// Override image_itinerary with custom error message
	image_itinerary: z
		.array(z.union([z.instanceof(File), z.string()]))
		.min(1, "at least one image is required"),
});

export default exchangeSchema;
