import * as DEither from "@duplojs/lang/either";
import { h, type Ref, type VNode } from "vue";
import { createFormField, type FormField, type FormFieldInstance, type FormFieldInstanceContext } from "@V/formField";
import { testTemplates } from "./templates";

export interface CreateTestFormFieldParams {
	check?(value: string, key: string): ReturnType<FormFieldInstance["check"]>;
	onReset?(value: Ref<string>, key: string): void;
	onDispose?(value: Ref<string>, key: string): void;
	getVNode?(value: string, key: string): VNode | null;
}

export function createFormFieldContext(
	params: Partial<FormFieldInstanceContext> = {},
): FormFieldInstanceContext {
	return {
		templates: testTemplates,
		getSlot: () => null,
		errorInterpreter: vi.fn(),
		codecs: undefined,
		...params,
	};
}

export function createTestFormField(
	defaultValue: string,
	params?: CreateTestFormFieldParams,
): FormField<string, unknown> {
	return createFormField(
		(modelValue, parentKey) => ({
			check: () => params?.check?.(modelValue.value, parentKey)
				?? Promise.resolve(DEither.success(modelValue.value)),
			reset: () => {
				params?.onReset?.(modelValue, parentKey);
			},
			dispose: () => {
				params?.onDispose?.(modelValue, parentKey);
			},
			getVNode: () => params?.getVNode?.(modelValue.value, parentKey) ?? h("span", { id: `field-${parentKey}` }, modelValue.value),
		}),
		defaultValue,
	) as FormField<string, unknown>;
}
