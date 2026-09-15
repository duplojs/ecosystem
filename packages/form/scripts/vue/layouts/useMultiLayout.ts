import * as DEither from "@duplojs/lang/either";
import * as DArray from "@duplojs/lang/array";
import { computed, effectScope, type VNode } from "vue";
import { type GetFormFieldCheckedValue, type GetFormFieldValue, type FormField, createFormField, type ErrorProperties, type MergeFormFieldSlots } from "@V/formField";
import type { VueComponent } from "@V/types";
import type { Templates } from "@V/template";

export interface MultiTemplateProperties {
	props: {
		fieldKey: string;
		getCurrentValue(): unknown;
		getFormFields(): (VNode | null)[];
	};
	slots: {
		formField(): any;
	};
}
declare module "@V/template" {
	interface AllowedTemplateComponents {
		multi: VueComponent<MultiTemplateProperties>;
	}
}

export type FormFieldWrapper = Record<
	string,
	FormField
>;

export type FormFieldEntry = [
	string,
	FormField,
];

export interface UseMultiFieldLayoutParams {
	class?: string;
	template?: Templates["multi"];
}

export function useMultiLayout<
	GenericFormFieldWrapper extends FormFieldWrapper,
>(
	formFieldWrapper: GenericFormFieldWrapper,
	params?: UseMultiFieldLayoutParams,
): FormField<
	{
		[Prop in keyof GenericFormFieldWrapper]: GetFormFieldValue<GenericFormFieldWrapper[Prop]>
	},
	{
		[Prop in keyof GenericFormFieldWrapper]: GetFormFieldCheckedValue<GenericFormFieldWrapper[Prop]>
	},
	MergeFormFieldSlots<
		GenericFormFieldWrapper[keyof GenericFormFieldWrapper]
	>
>;

export function useMultiLayout<
	GenericFormFieldEntry extends FormFieldEntry,
>(
	formFieldEntries: GenericFormFieldEntry[],
	params?: UseMultiFieldLayoutParams,
): FormField<
	{
		[Entry in GenericFormFieldEntry as string]: GetFormFieldValue<Entry[1]>
	},
	{
		[Entry in GenericFormFieldEntry as string]: GetFormFieldCheckedValue<Entry[1]>
	},
	MergeFormFieldSlots<
		GenericFormFieldEntry[1]
	>
>;

export function useMultiLayout(
	formFields: FormFieldWrapper | FormFieldEntry[],
	params?: UseMultiFieldLayoutParams,
): FormField<
	Record<string, unknown>,
	Record<string, unknown>
> {
	const formFieldEntries = formFields instanceof Array
		? formFields
		: Object.entries(formFields);

	return createFormField(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_MUL`;

			const template = params?.template ?? context.templates.multi;

			const scope = effectScope();
			const { formFieldInstanceEntries } = scope.run(() => {
				const formFieldInstanceEntries = formFieldEntries
					.map(
						([subKey, formField]) => [
							subKey,
							formField.new(
								computed({
									get: () => modelValue.value[subKey],
									set: (value) => {
										modelValue.value[subKey] = value;
									},
								}),
								`${key}-${subKey}`,
								context,
							),
						] as const,
					);

				return {
					formFieldInstanceEntries,
				};
			})!;

			const check = async() => {
				const result: Record<string, unknown> = {};
				const errors: ErrorProperties[] = [];

				for (let index = 0; index < formFieldInstanceEntries.length; index++) {
					const [key, formFieldInstance] = formFieldInstanceEntries[index]!;

					const checkResult = await formFieldInstance.check();

					if (DEither.isLeft(checkResult)) {
						errors.push(...DEither.unwrapLeft(checkResult));
					} else {
						result[key] = DEither.unwrapRight(checkResult);
					}
				}

				if (DArray.minElements(errors, 1)) {
					return DEither.error(errors);
				}

				return DEither.success(result);
			};

			const reset = () => {
				formFieldInstanceEntries.forEach(
					([, formFieldInstance]) => void formFieldInstance.reset(),
				);
			};

			const dispose = () => {
				scope.stop();
				formFieldInstanceEntries.forEach(
					([, formFieldInstance]) => void formFieldInstance.dispose(),
				);
			};

			const getCurrentValue = () => modelValue.value;

			const getFormFieldVNodes = () => formFieldInstanceEntries.map(
				(entry) => entry[1].getVNode(),
			);

			const getVNode = () => template.getVNode(
				{
					fieldKey: key,
					getFormFields: getFormFieldVNodes,
					getCurrentValue,
					class: params?.class,
				},
				{
					formField: getFormFieldVNodes,
				},
			);

			return {
				check,
				reset,
				dispose,
				getVNode,
			};
		},
		formFieldEntries.reduce<Record<string, unknown>>(
			(accumulator, entry) => {
				accumulator[entry[0]] = entry[1].defaultValue;

				return accumulator;
			},
			{},
		),
	);
}
