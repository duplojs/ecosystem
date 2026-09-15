import type { SetupContext, VNode } from "vue";

export type FunctionSelectInputComponent = (
	& ((
		props: {
			fieldKey: string;
			options: {
				value: string;
				label: string;
			}[];
			modelValue: string;
		},
		context: SetupContext<{
			"update:modelValue"(value: string): any;
		}>,
	) => VNode)
	& {
		emits: ["update:modelValue"];
	}
);

