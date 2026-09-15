import { createFormField, type GetFormFieldSlots, type FormField, type GetFormFieldCheckedValue, type GetFormFieldValue } from "@V/formField";
import type { Templates } from "@V/template";
import type { VueComponent } from "@V/types";

export interface SectionTemplateProperties {
	props: {
		fieldKey: string;
		getCurrentValue(): unknown;
		title?: string;
	};
	slots: {
		formField(): any;
	};
}
declare module "@V/template" {
	interface AllowedTemplateComponents {
		section: VueComponent<SectionTemplateProperties>;
	}
}

export interface UseSectionLayoutParams {
	title?: string;
	class?: string;
	template?: Templates["section"];
}

export function useSectionLayout<
	GenericFormField extends FormField,
>(
	formField: GenericFormField,
	params?: UseSectionLayoutParams,
): FormField<
	GetFormFieldValue<GenericFormField>,
	GetFormFieldCheckedValue<GenericFormField>,
	GetFormFieldSlots<GenericFormField>
>;

export function useSectionLayout(
	formField: FormField,
	params?: UseSectionLayoutParams,
): FormField {
	return createFormField(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_SEC`;

			const template = params?.template ?? context.templates.section;

			const formFieldInstance = formField.new(
				modelValue,
				key,
				context,
			);

			const check = () => formFieldInstance.check();

			const reset = () => {
				formFieldInstance.reset();
			};

			const dispose = () => {
				formFieldInstance.dispose();
			};

			const getFormFieldVNode = () => formFieldInstance.getVNode();

			const getCurrentValue = () => modelValue.value;

			const getVNode = () => template.getVNode(
				{
					fieldKey: key,
					getCurrentValue,
					title: params?.title,
					class: params?.class,
				},
				{
					formField: getFormFieldVNode,
				},
			);

			return {
				check,
				reset,
				dispose,
				getVNode,
			};
		},
		formField.defaultValue,
	);
}
