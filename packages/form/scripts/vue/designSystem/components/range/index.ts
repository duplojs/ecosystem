import { createInput } from "@V/input";
import RangeInput from "./RangeInput.vue";
import DualRangeInput from "./DualRangeInput.vue";

export { default as DualRangeInput } from "./DualRangeInput.vue";
export { default as RangeInput } from "./RangeInput.vue";

export const useRangeInput = createInput(
	RangeInput,
	{
		defaultValue: 0,
	},
);

export const useDualRangeInput = createInput(
	DualRangeInput,
	{
		defaultValue: () => ({
			start: 0,
			end: 100,
		}),
	},
);
