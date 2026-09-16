
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import { computed, effectScope, ref, type VNode } from "vue";
import { createFormField, type GetFormFieldCheckedValue, type FormField, type GetFormFieldValue, type FormFieldInstance, type ErrorProperties, type MergeFormFieldSlots } from "@V/formField";
import type { VueComponent } from "@V/types";
import type { Templates } from "@V/template";

export interface StepTemplateProperties {
	props: {
		fieldKey: string;
		stepQuantity: number;
		isLastStep(): boolean;
		getFormFields(): (() => (VNode | null))[];
		getCurrentValue(): unknown;
		getCurrentStep(): number;
		getErrorMessageNotAtLastStep(): null | string;
	};
	emits: {
		nextStep: [];
		previousStep: [];
		resetStep: [];
	};
	slots: {
		formField(): any;
	};
}

declare module "@V/template" {
	interface AllowedTemplateComponents {
		step: VueComponent<StepTemplateProperties>;
	}
}

export interface UseStepLayoutParams {
	errorMessageNotAtLastStep: string;
	class?: string;
	template?: Templates["step"];
}

export function useStepLayout<
	const GenericFormFields extends DCommon.AnyTuple<FormField>,
>(
	formFields: GenericFormFields,
	params: UseStepLayoutParams,
): FormField<
	{
		currentStep: Exclude<
			keyof GenericFormFields,
			keyof any[]
		> extends `${infer InferredStep extends number}`
			? InferredStep
			: never;
		steps: {
			-readonly [Prop in keyof GenericFormFields]: GetFormFieldValue<
				Extract<GenericFormFields[Prop], FormField>
			>
		};
	},
	{
		[Prop in keyof GenericFormFields]: GetFormFieldCheckedValue<GenericFormFields[Prop]>
	},
	MergeFormFieldSlots<
		GenericFormFields[number]
	>
>;

export function useStepLayout(
	formFields: DCommon.AnyTuple<FormField>,
	params: UseStepLayoutParams,
): FormField<
	{
		currentStep: number;
		steps: Record<number, unknown>;
	},
	Record<number, unknown>
> {
	return createFormField(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_STP`;
			const template = params?.template ?? context.templates.step;

			const cacheFormFields: Record<number, FormFieldInstance> = {};
			const scope = effectScope();
			const {
				formFieldInstances,
				errorMessageNotAtLastStep,
			} = scope.run(() => {
				const errorMessageNotAtLastStep = ref<null | string>(null);
				const formFieldInstances = formFields.map(
					(formField, index) => (
						() => {
							if (cacheFormFields[index] === undefined) {
								cacheFormFields[index] = formField.new(
									computed({
										get: () => modelValue.value.steps[index],
										set: (value) => {
											modelValue.value.steps[index] = value;
										},
									}),
									`${key}-${index}`,
									context,
								);
							}

							return cacheFormFields[index];
						}
					),
				);

				return {
					formFieldInstances,
					errorMessageNotAtLastStep,
				};
			})!;

			const check = async() => {
				const result: unknown[] = [];
				const errors: ErrorProperties[] = [];

				if (isLastStep() !== true) {
					errorMessageNotAtLastStep.value = params.errorMessageNotAtLastStep;
					return DEither.error(
						DCommon.infer(<const>[{ key }]) satisfies readonly ErrorProperties[] & DArray.MinElements<1>,
					);
				}

				let firstStepIndexError: undefined | number = undefined;
				for (let index = 0; index < formFieldInstances.length; index++) {
					const formFieldInstance = formFieldInstances[index]!();

					const checkResult = await formFieldInstance.check();

					if (DEither.isLeft(checkResult)) {
						if (firstStepIndexError === undefined) {
							firstStepIndexError = index;
						}
						errors.push(...DEither.unwrapLeft(checkResult));
					} else {
						result.push(DEither.unwrapRight(checkResult));
					}
				}

				if (firstStepIndexError !== undefined) {
					modelValue.value.currentStep = firstStepIndexError;
				}

				if (DArray.minElements(errors, 1)) {
					return DEither.error(errors);
				}

				return DEither.success(result);
			};

			const reset = () => {
				Object.values(cacheFormFields).forEach(
					(formFieldInstance) => void formFieldInstance.reset(),
				);
			};

			const dispose = () => {
				scope.stop();
				Object.values(cacheFormFields).forEach(
					(formFieldInstance) => void formFieldInstance.dispose(),
				);
			};

			const getCurrentValue = () => modelValue.value;

			const getFormFieldVNodes = () => formFieldInstances.map(
				(getFormFieldInstance) => () => getFormFieldInstance().getVNode(),
			);

			const getCurrentStep = () => modelValue.value.currentStep;

			const isLastStep = () => DArray.isLastIndex(formFields, modelValue.value.currentStep);

			const getCurrentFormFieldStepVNodes = () => formFieldInstances[modelValue.value.currentStep]!().getVNode();

			const getErrorMessageNotAtLastStep = () => errorMessageNotAtLastStep.value;

			const onNextStep = async() => {
				errorMessageNotAtLastStep.value = null;
				const result = await formFieldInstances[modelValue.value.currentStep]!().check();

				if (DEither.isLeft(result)) {
					return;
				}

				const newIndexStep = modelValue.value.currentStep + 1;

				if (modelValue.value.steps[newIndexStep] === undefined) {
					return;
				}

				modelValue.value.currentStep = newIndexStep;
			};

			const onPreviousStep = () => {
				errorMessageNotAtLastStep.value = null;
				const newIndexStep = modelValue.value.currentStep - 1;

				if (modelValue.value.steps[newIndexStep] === undefined) {
					return;
				}

				modelValue.value.currentStep = newIndexStep;
			};

			const onResetStep = () => {
				errorMessageNotAtLastStep.value = null;
				formFieldInstances[modelValue.value.currentStep]!().reset();

				modelValue.value.steps[modelValue.value.currentStep] = DCommon.simpleClone(
					formFields[modelValue.value.currentStep]?.defaultValue,
				);
			};

			const getVNode = () => template.getVNode(
				{
					fieldKey: key,
					stepQuantity: formFields.length,
					getFormFields: getFormFieldVNodes,
					getCurrentValue,
					getCurrentStep,
					isLastStep,
					getErrorMessageNotAtLastStep,
					onNextStep,
					onPreviousStep,
					onResetStep,
					class: params.class,
				},
				{
					formField: getCurrentFormFieldStepVNodes,
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
			currentStep: 0,
			steps: formFields.map(
				(formField) => formField.defaultValue,
			),
		},
	);
}
