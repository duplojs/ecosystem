import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { computed, effectScope, watch } from "vue";
import { createFormField, type FormFieldInstance, type FormField, type GetFormFieldCheckedValue, type GetFormFieldValue, type MergeFormFieldSlots } from "@V/formField";
import type { Templates } from "@V/template";
import type { VueComponent } from "@V/types";

export interface UnionTemplateProperties {
	props: {
		fieldKey: string;
		kinds: string[];
		getCurrentValue(): unknown;
		getCurrentKind(): string;
	};
	emits: {
		changeKind: [kind: string];
	};
	slots: {
		formField(): any;
	};
}
declare module "@V/template" {
	interface AllowedTemplateComponents {
		union: VueComponent<UnionTemplateProperties>;
	}
}

export interface UseUnionLayoutParams<
	GenericKind extends string = string,
> {
	defaultKind: GenericKind;
	class?: string;
	template?: Templates["union"];
}

export type FormFieldUnionElement = [string, FormField];

export function useUnionLayout<
	const GenericFormFieldElements extends DCommon.AnyTuple<FormFieldUnionElement>,
>(
	formFieldUnionElements: GenericFormFieldElements,
	params: UseUnionLayoutParams<GenericFormFieldElements[number][0]>,
): FormField<
	Extract<GenericFormFieldElements[number], any> extends infer InferredFormFieldElements extends FormFieldUnionElement
		? InferredFormFieldElements extends FormFieldUnionElement
			? {
				readonly kind: InferredFormFieldElements[0];
				value: GetFormFieldValue<InferredFormFieldElements[1]>;
				updateKind(
					kind: GenericFormFieldElements[number][0],
				): void;
				updateKind<
					GenericKind extends GenericFormFieldElements[number][0],
				>(
					kind: GenericKind,
					value: GetFormFieldValue<
						Extract<
							GenericFormFieldElements[number],
							[GenericKind, any]
						>[1]
					>,
				): void;
			}
			: never
		: never,
	GenericFormFieldElements[number] extends infer InferredFormFieldElements extends FormFieldUnionElement
		? InferredFormFieldElements extends FormFieldUnionElement
			? {
				kind: InferredFormFieldElements[0];
				value: GetFormFieldCheckedValue<InferredFormFieldElements[1]>;
			}
			: never
		: never,
	MergeFormFieldSlots<
		GenericFormFieldElements[number][1]
	>
>;

export function useUnionLayout(
	formFieldUnionElements: DCommon.AnyTuple<FormFieldUnionElement>,
	params: UseUnionLayoutParams,
): FormField<
	{
		kind: string;
		value: unknown;
		updateKind(kind: string, value?: unknown): void;
	},
	{
		kind: string;
		value: unknown;
	}
> {
	const formFieldUnionMapper = Object.fromEntries(formFieldUnionElements);

	const kinds = Object.keys(formFieldUnionMapper);

	return createFormField(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_UNI`;
			const template = params?.template ?? context.templates.union;

			let cacheValue: Record<string, unknown> = {};
			const cacheFormFields: Record<string, FormFieldInstance> = {};
			const scope = effectScope();
			const {
				formFieldInstances,
			} = scope.run(() => {
				watch(
					modelValue,
					() => {
						modelValue.value.updateKind = (kind, ...args) => {
							cacheValue[modelValue.value.kind] = modelValue.value.value;

							const newValue = (() => {
								if (args.length === 1) {
									return args[0];
								} else if (kind in cacheValue) {
									return cacheValue[kind];
								} else {
									return DCommon.simpleClone(
										formFieldUnionMapper[kind]!.defaultValue,
									);
								}
							})();

							modelValue.value.kind = kind;
							modelValue.value.value = newValue;
						};
						cacheValue = {};
					},
					{
						immediate: true,
					},
				);

				const formFieldInstances = Object.fromEntries(
					formFieldUnionElements
						.map(
							([kind, formField]) => [
								kind,
								() => {
									if (cacheFormFields[kind] === undefined) {
										cacheFormFields[kind] = formField.new(
											computed({
												get: () => kind === modelValue.value.kind
													? modelValue.value.value
													: formFieldUnionMapper[kind]!.defaultValue,
												set: (value) => {
													if (kind !== modelValue.value.kind) {
														return;
													}
													modelValue.value.value = value;
												},
											}),
											`${key}-${kind}`,
											context,
										);
									}

									return cacheFormFields[kind];
								},
							],
						),
				);

				return {
					formFieldInstances,
				};
			})!;

			const check = async() => {
				const checkResult = await formFieldInstances[modelValue.value.kind]!().check();
				if (DEither.isLeft(checkResult)) {
					return checkResult;
				}

				return DEither.success({
					kind: modelValue.value.kind,
					value: DEither.unwrapRight(checkResult),
				});
			};

			const reset = () => {
				cacheValue = {};
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

			const getFieldVNode = () => formFieldInstances[modelValue.value.kind]!().getVNode();

			const getCurrentKind = () => modelValue.value.kind;

			const onChangeKind = (value: string) => {
				if (formFieldUnionMapper[value] === undefined) {
					return;
				}

				modelValue.value.updateKind(value);
			};

			const getVNode = () => template.getVNode(
				{
					fieldKey: key,
					kinds,
					getCurrentValue,
					getCurrentKind,
					onChangeKind,
					class: params.class,
				},
				{
					formField: getFieldVNode,
				},
			);

			return {
				check,
				reset,
				dispose,
				getVNode,
			};
		},
		{
			kind: params.defaultKind,
			value: formFieldUnionMapper[params.defaultKind]!.defaultValue,
			updateKind: () => {},
		},
	);
}
