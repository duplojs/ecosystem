import * as DChrono from "@duplojs/lang/chrono";
import { createInput } from "@V/input";
import DateInput from "./DateInput.vue";
import RangeDateInput from "./RangeDateInput.vue";

export { default as DateInput } from "./DateInput.vue";
export { default as RangeDateInput } from "./RangeDateInput.vue";

export const useDateInput = createInput(
	DateInput,
	{ defaultValue: () => DChrono.now() },
);

export const useRangeDateInput = createInput(
	RangeDateInput,
	{
		defaultValue: () => ({
			from: DChrono.now(),
			to: DChrono.addDays(DChrono.now(), 1),
		}),
	},
);
