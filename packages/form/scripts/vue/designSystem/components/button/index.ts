import { type FunctionButtonComponent } from "@V/types";
import { h } from "vue";

import PrimaryButton from "./PrimaryButton.vue";
import OutlineButton from "./OutlineButton.vue";
import DestructiveButton from "./DestructiveButton.vue";

export { default as TheButton } from "./TheButton.vue";
export type { Icon, IconPosition, Props as TheButtonProps, Size, Variant } from "./TheButton.vue";
export { default as PrimaryButton } from "./PrimaryButton.vue";
export { default as DestructiveButton } from "./DestructiveButton.vue";
export { default as GhostButton } from "./GhostButton.vue";
export { default as OutlineButton } from "./OutlineButton.vue";

export const templateFormAddButton: FunctionButtonComponent = ({ label, disabled }) => h(
	PrimaryButton,
	{
		label,
		disabled,
		size: "sm",
		iconSize: "lg",
		icon: "plus",
		iconPosition: "start",
	},
);

export const templateFormRemoveButton: FunctionButtonComponent = ({ label, disabled }) => h(
	OutlineButton,
	{
		label,
		disabled,
		size: "sm",
		iconSize: "lg",
		iconPosition: "start",
	},
);

export const templateFormResetButton: FunctionButtonComponent = ({ label, disabled }) => h(
	DestructiveButton,
	{
		label,
		disabled,
		size: "sm",
		icon: "reset",
		iconSize: "lg",
		iconPosition: "start",
	},
);

export const templateFormNextButton: FunctionButtonComponent = ({ label, disabled }) => h(
	PrimaryButton,
	{
		label,
		disabled,
		size: "sm",
		icon: "next",
		iconSize: "lg",
		iconPosition: "end",
	},
);

export const templateFormPreviousButton: FunctionButtonComponent = ({ label, disabled }) => h(
	OutlineButton,
	{
		label,
		disabled,
		size: "sm",
		icon: "previous",
		iconSize: "lg",
		iconPosition: "start",
	},
);

