import * as DChrono from "@duplojs/lang/chrono";
import { createInput } from "@V/input";
import RangeTimeInput from "./RangeTimeInput.vue";
import TimeInput from "./TimeInput.vue";
import "@vue/reactivity";

export { default as TimeInput } from "./TimeInput.vue";
export { default as RangeTimeInput } from "./RangeTimeInput.vue";

declare module "@vue/reactivity" {
	interface RefUnwrapBailTypes {
		duplojsTime: DChrono.TheTime;
	}
}

export const useTimeInput = createInput(
	TimeInput,
	{
		defaultValue: () => DChrono.createTime(0, "second"),
	},
);

export const useRangeTimeInput = createInput(
	RangeTimeInput,
	{
		defaultValue: () => ({
			from: DChrono.createTime(0, "second"),
			to: DChrono.createTime(0, "second"),
		}),
	},
);
