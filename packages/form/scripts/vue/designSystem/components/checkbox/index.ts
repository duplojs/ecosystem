import { createInput } from "@V/input";
import TheCheckbox from "./TheCheckbox.vue";
import CheckboxPolicy from "./CheckboxPolicy.vue";

export { default as TheCheckbox } from "./TheCheckbox.vue";
export { default as CheckboxPolicy } from "./CheckboxPolicy.vue";

export const useCheckbox = createInput(
	TheCheckbox,
	{ defaultValue: false },
);

export const useCheckboxPolicy = createInput(
	CheckboxPolicy,
	{ defaultValue: false },
);
