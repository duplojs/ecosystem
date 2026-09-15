import type { FunctionSelectInputComponent } from "@V/types";
import { h } from "vue";

import SelectInput from "./SelectInput.vue";
import { createInput } from "@V/input";
import FileInput from "./FileInput.vue";
import NumberInput from "./NumberInput.vue";
import RadioGroup from "./RadioGroup.vue";
import TextareaInput from "./TextareaInput.vue";
import TextInput from "./TextInput.vue";

export * from "./icons";
export * from "./button";
export * from "./checkbox";
export * from "./range";
export * from "./date";
export * from "./time";
export { default as SelectInput } from "./SelectInput.vue";
export { default as NumberInput } from "./NumberInput.vue";
export { default as RadioGroup } from "./RadioGroup.vue";
export { default as TextInput } from "./TextInput.vue";
export { default as TextareaInput } from "./TextareaInput.vue";
export { default as FileInput } from "./FileInput.vue";

export const templateFormSelect: FunctionSelectInputComponent = (
	props,
	context,
) => h(
	SelectInput,
	{
		...props,
		"onUpdate:modelValue": (value) => {
			if (value === null) {
				return;
			}

			context.emit("update:modelValue", value);
		},
	},
);
templateFormSelect.emits = ["update:modelValue"];

export const useFileInput = createInput(
	FileInput,
	{
		defaultValue: null,
	},
);

export const useNumberInput = createInput(
	NumberInput,
	{
		defaultValue: 0,
	},
);

export const useRadioGroup = createInput(
	RadioGroup,
	{
		defaultValue: null,
		props: {
			options: [],
		},
	},
);

export const useSelectInput = createInput(
	SelectInput,
	{
		defaultValue: null,
		props: {
			options: [],
		},
	},
);

export const useTextareaInput = createInput(
	TextareaInput,
	{
		defaultValue: "",
	},
);

export const useTextInput = createInput(
	TextInput,
	{
		defaultValue: "",
	},
);
