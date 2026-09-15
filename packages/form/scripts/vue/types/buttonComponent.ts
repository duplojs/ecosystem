import type { VNode } from "vue";

export type FunctionButtonComponent = (
	props: {
		label?: string;
		disabled?: boolean;
	},
) => VNode;
