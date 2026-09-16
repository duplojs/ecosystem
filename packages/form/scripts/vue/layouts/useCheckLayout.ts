import * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { effectScope, ref, watch } from "vue";
import { createFormField, type GetFormFieldCheckedValue, type FormField, type GetFormFieldValue, type GetFormFieldSlots, type FormFieldInstance, type DetailsError } from "@V/formField";
import type { VueComponent } from "@V/types";
import type { Templates } from "@V/template";

export interface CheckTemplateProperties {
	props: {
		fieldKey: string;
		getCurrentValue(): unknown;
		getErrorMessage(): string | null;
	};
	slots: {
		formField(): any;
	};
}

declare module "@V/template" {
	interface AllowedTemplateComponents {
		check: VueComponent<CheckTemplateProperties>;
	}
}

export interface UseCheckLayoutParams<
	GenericDataStructure extends DDataStructure.Structure = DDataStructure.Structure,
	GenericCheckedValue extends unknown = unknown,
> {
	dataStructure?: GenericDataStructure;
	refine?(value: GenericCheckedValue): DCommon.MaybePromise<DEither.Ok | DEither.Error<string>>;
	class?: string;
	template?: Templates["check"];
	codecs?: DDataStructure.Codecs;
}

export function useCheckLayout<
	GenericFormField extends FormField,
	GenericDataStructure extends DDataStructure.Structure = never,
>(
	formField: GenericFormField,
	params: UseCheckLayoutParams<
		GenericDataStructure,
		GetFormFieldCheckedValue<GenericFormField>
	>,
): FormField<
	GetFormFieldValue<GenericFormField>,
	DCommon.IsEqual<GenericDataStructure, never> extends true
		? GetFormFieldCheckedValue<GenericFormField>
		: DDataStructure.StructureValue<GenericDataStructure>,
	GetFormFieldSlots<GenericFormField>
>;

export function useCheckLayout(
	formField: FormField,
	params: UseCheckLayoutParams,
): FormField {
	const getDataStructureErrorMessage = (
		error: DDataStructure.Error,
		errorInterpreter: DDataStructure.ErrorInterpreter,
	) => {
		const [issue] = errorInterpreter(error);

		return issue?.interpretedMessage.interpretedSubSource
			?? issue?.interpretedMessage.interpretedSource
			?? issue?.interpretedMessage.subSource
			?? issue?.interpretedMessage.source
			?? "Unknown Error";
	};

	return createFormField(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_CHK`;
			const template = params?.template ?? context.templates.check;

			const formFieldInstance = formField.new(
				modelValue,
				key,
				context,
			);

			const scope = effectScope();
			const { errorMessage } = scope.run(() => {
				const errorMessage = ref<null | string>(null);

				watch(
					modelValue,
					async() => {
						if (errorMessage.value !== null) {
							await check();
						}
					},
					{ flush: "post" },
				);

				return {
					errorMessage,
				};
			})!;

			const check: FormFieldInstance["check"] = async() => {
				const fieldResult = await formFieldInstance.check();

				if (DEither.isLeft(fieldResult)) {
					return fieldResult;
				}

				const fieldValue = DEither.unwrapRight(fieldResult);
				const refineResult = await params.refine?.(fieldValue);

				if (DEither.isLeft(refineResult)) {
					errorMessage.value = DEither.unwrapLeft(refineResult);

					return DEither.error<DetailsError>(
						DCommon.cast([{ key }]),
					);
				}

				const result = params.dataStructure === undefined
					? DEither.success(fieldValue)
					: await params.dataStructure.asyncParse(
						fieldValue,
						params.codecs ?? context.codecs,
					);

				if (DEither.isLeft(result)) {
					const dataStructureError = DEither.unwrapLeft(result)!;
					errorMessage.value = getDataStructureErrorMessage(dataStructureError, context.errorInterpreter);

					return DEither.error<DetailsError>(
						DCommon.cast([
							{
								key,
								dataStructureError,
							},
						]),
					);
				}

				errorMessage.value = null;
				return DEither.success(DEither.unwrapRight(result));
			};

			const reset = () => {
				formFieldInstance.reset();
				errorMessage.value = null;
			};

			const dispose = () => {
				scope.stop();
				formFieldInstance.dispose();
			};

			const getCurrentValue = () => modelValue.value;

			const getFormFieldVNode = () => formFieldInstance.getVNode();

			const getErrorMessage = () => errorMessage.value;

			const getVNode = () => template.getVNode(
				{
					fieldKey: key,
					getErrorMessage,
					getCurrentValue,
					class: params.class,
				},
				{ formField: getFormFieldVNode },
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
