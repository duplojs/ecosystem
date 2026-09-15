import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DArray from "@duplojs/lang/array";
import type * as DTuple from "@duplojs/lang/tuple";
import { computed, effectScope, ref, watch, type VNode } from "vue";
import type { VueComponent } from "@V/types";
import type { Templates } from "@V/template";
import { createFormField, type FormFieldInstance, type ErrorProperties, type FormField, type GetFormFieldCheckedValue, type GetFormFieldValue, type GetFormFieldSlots } from "@V/formField";

export interface RepeatTemplateProperties {
	props: {
		fieldKey: string;
		max: number;
		min: number;
		getFormFieldsQuantity(): number;
		getCurrentValue(): unknown;
		getFormFields(): (VNode | null)[];
	};
	emits: {
		addElement: [];
		removeElement: [index: number];
		resetElement: [index: number];
	};
	slots: {
		formField(): any;
	};
}

declare module "@V/template" {
	interface AllowedTemplateComponents {
		repeat: VueComponent<RepeatTemplateProperties>;
	}
}

export interface UseRepeatLayoutParams<
	GenericMin extends number = number,
> {
	max: number;
	min?: GenericMin;
	class?: string;
	template?: Templates["repeat"];
}

export function useRepeatLayout<
	GenericFormField extends FormField,
	GenericMin extends number = 0,
>(
	formField: GenericFormField,
	params: UseRepeatLayoutParams<GenericMin>,
): FormField<
	[
		...DTuple.Create<GetFormFieldValue<GenericFormField>, GenericMin>,
		...GetFormFieldValue<GenericFormField>[],
	],
	[
		...DTuple.Create<GetFormFieldCheckedValue<GenericFormField>, GenericMin>,
		...GetFormFieldCheckedValue<GenericFormField>[],
	],
	GetFormFieldSlots<GenericFormField>
>;

export function useRepeatLayout(
	formField: FormField,
	params: UseRepeatLayoutParams,
): FormField<unknown[]> {
	const minElements = params.min ?? 0;
	const maxElements = params.max;

	return createFormField(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_REP`;

			const template = params?.template ?? context.templates.repeat;

			const cacheFormFields: Record<number, FormFieldInstance> = {};
			const getFormFieldInstance = (index: number) => {
				if (cacheFormFields[index] === undefined) {
					cacheFormFields[index] = formField.new(
						computed({
							get: () => index in modelValue.value
								? modelValue.value[index]
								: formField.defaultValue,
							set: (value) => {
								if (index >= modelValue.value.length) {
									return;
								}

								modelValue.value[index] = value;
							},
						}),
						`${key}-${index}`,
						context,
					);
				}

				return cacheFormFields[index];
			};
			const scope = effectScope();
			const {
				formFieldInstances,
			} = scope.run(() => {
				const formFieldInstances = ref<FormFieldInstance[]>([]);

				watch(
					() => modelValue.value.length,
					(length) => {
						formFieldInstances.value = Array.from({ length })
							.map(
								(__, index) => getFormFieldInstance(index),
							);
					},
					{ immediate: true },
				);

				return {
					formFieldInstances,
				};
			})!;

			const check = async() => {
				const result: unknown[] = [];
				const errors: ErrorProperties[] = [];

				for (let index = 0; index < formFieldInstances.value.length; index++) {
					const formFieldInstance = formFieldInstances.value[index]!;

					const checkResult = await formFieldInstance.check();

					if (DEither.isLeft(checkResult)) {
						errors.push(...DEither.unwrapLeft(checkResult));
					} else {
						result.push(DEither.unwrapRight(checkResult));
					}
				}

				if (DArray.minElements(errors, 1)) {
					return DEither.error(errors);
				}

				return DEither.success(result);
			};

			const reset = () => {
				Object.entries(cacheFormFields).forEach(
					([, formFieldInstance]) => void formFieldInstance.reset(),
				);
			};

			const dispose = () => {
				scope.stop();
				Object.entries(cacheFormFields).forEach(
					([, formFieldInstance]) => void formFieldInstance.dispose(),
				);
			};

			const getCurrentValue = () => modelValue.value;

			const getFormFieldVNodes = () => formFieldInstances.value.map(
				(formFieldInstance) => formFieldInstance.getVNode(),
			);

			const getFormFieldsQuantity = () => formFieldInstances.value.length;

			const onAddElement = () => {
				if (modelValue.value.length >= maxElements) {
					return;
				}

				modelValue.value.push(
					DCommon.simpleClone(formField.defaultValue),
				);
			};

			const onRemoveElement = (index: number) => {
				if (modelValue.value.length <= minElements) {
					return;
				}

				modelValue.value.splice(index, 1);
			};

			const onResetElement = (index: number) => {
				if (index in modelValue.value) {
					formFieldInstances.value[index]?.reset();
					modelValue.value[index] = DCommon.simpleClone(formField.defaultValue);
				}
			};

			const getVNode = () => template.getVNode(
				{
					fieldKey: key,
					getFormFields: getFormFieldVNodes,
					getFormFieldsQuantity,
					getCurrentValue,
					max: maxElements,
					min: minElements,
					onAddElement,
					onRemoveElement,
					onResetElement,
					class: params.class,
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
		Array
			.from({ length: minElements })
			.fill(formField.defaultValue),
	);
}
