import * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { createFormField, type FormFieldInstance, type FormField, type DetailsError } from "./formField";
import { type VueComponent } from "./types";
import { effectScope, h, ref, watch } from "vue";
import { type Templates } from "./template";

export interface InputTemplateProperties {
	props: {
		getLabel?(): string;
		getCurrentValue(): unknown;
		getErrorMessage?(): string | null;
		fieldKey: string;
	};
	slots: {
		input(): any;
	};
}

declare module "./template" {
	interface AllowedTemplateComponents {
		input: VueComponent<InputTemplateProperties>;
	}
}

export interface ExposeInputProperties {
	check?(): DCommon.MaybePromise<DEither.Error<DetailsError> | DEither.Success<unknown>>;
	reset?: FormFieldInstance["reset"];
	dispose?: FormFieldInstance["dispose"];
}

export type VueInputComponent = VueComponent<{
	props: {
		modelValue?: unknown;
	};
	emits: {
		"update:modelValue"(value: any): any;
	};
	expose: ExposeInputProperties;
}>;

export type GetVueInputComponentValue<
	GenericInputComponentInstance extends InstanceType<VueInputComponent>,
> = Exclude<
	GenericInputComponentInstance["$props"]["modelValue"],
	undefined
>;

export type GetVueInputComponentProps<
	GenericInputComponentInstance extends InstanceType<VueInputComponent>,
> = DCommon.SimplifyTopLevel<
	Omit<
		GenericInputComponentInstance["$props"],
		"modelValue" | "onUpdate:modelValue" | "id" | "ref" | "key"
	>
>;

export type GetVueInputComponentCheckedValue<
	GenericInputComponentInstance extends InstanceType<VueInputComponent>,
> = GenericInputComponentInstance["check"] extends DCommon.AnyFunction
	? DEither.GetValue<
		Extract<
			ReturnType<
				GenericInputComponentInstance["check"]
			>,
			DEither.Success
		>
	>
	: GetVueInputComponentValue<GenericInputComponentInstance>;

export type CreateInputParams<
	GenericInputComponentInstance extends InstanceType<VueInputComponent> = InstanceType<VueInputComponent>,
> = DCommon.SimplifyTopLevel<
	& {
		defaultValue: (
			| Exclude<
				GetVueInputComponentValue<GenericInputComponentInstance>,
				object | DCommon.AnyFunction
			>
			| (() => GetVueInputComponentValue<GenericInputComponentInstance>)
		);
		template?: Templates["input"];
		codecs?: DDataStructure.Codecs;
	}
	& (
		GetVueInputComponentProps<
			GenericInputComponentInstance
		> extends infer InferredProps
			? {} extends InferredProps
				? { props?: InferredProps }
				: { props: InferredProps }
			: never
	)
>;

export interface UseInputParams<
	GenericInputComponentInstance extends InstanceType<VueInputComponent> = InstanceType<VueInputComponent>,
	GenericDataStructure extends DDataStructure.Structure = DDataStructure.Structure,
> {
	label?: DCommon.MayBeGetter<string>;
	defaultValue?: (
		| Exclude<
			GetVueInputComponentValue<GenericInputComponentInstance>,
			object | DCommon.AnyFunction
		>
		| (() => GetVueInputComponentValue<GenericInputComponentInstance>)
	);
	props?: DCommon.MayBeGetter<
		GetVueInputComponentProps<
			GenericInputComponentInstance
		>
	>;
	dataStructure?: GenericDataStructure;
	class?: string;
	template?: Templates["input"];
	codecs?: DDataStructure.Codecs;
}

export type UseInput<
	GenericInputComponentInstance extends InstanceType<VueInputComponent> = InstanceType<VueInputComponent>,
> = <
	GenericDataStructure extends DDataStructure.Structure = never,
>(
	params?: UseInputParams<
		GenericInputComponentInstance,
		GenericDataStructure
	>,
) => FormField<
	GetVueInputComponentValue<GenericInputComponentInstance>,
	DCommon.IsEqual<GenericDataStructure, never> extends true
		? GetVueInputComponentCheckedValue<GenericInputComponentInstance>
		: DDataStructure.StructureValue<GenericDataStructure>,
	{}
>;

export function createInput<
	GenericInputComponent extends VueInputComponent,
	GenericInputComponentInstance extends InstanceType<GenericInputComponent>,
>(
	inputComponent: GenericInputComponent,
	defaultParams: CreateInputParams<GenericInputComponentInstance>,
): UseInput<GenericInputComponentInstance>;

export function createInput(
	inputComponent: VueInputComponent,
	defaultParams: CreateInputParams,
): UseInput {
	return (params: UseInputParams = {}) => {
		const defaultValue = (() => {
			if (params.defaultValue !== undefined) {
				return typeof params.defaultValue === "function"
					? params.defaultValue()
					: params.defaultValue;
			}

			return typeof defaultParams.defaultValue === "function"
				? defaultParams.defaultValue()
				: defaultParams.defaultValue;
		})();

		const getLocalProps = typeof params.props === "function"
			? params.props
			: () => params.props;

		const preparedLabel = params.label;
		const getLabel = typeof preparedLabel === "string"
			? () => preparedLabel
			: preparedLabel;
		const getDataStructureErrorMessage = (error: DDataStructure.Error) => {
			const [issue] = error.issues;

			return issue && "message" in issue
				? issue.message ?? "Error"
				: "Error";
		};

		return createFormField(
			(modelValue, parentKey, context) => {
				const key = `${parentKey}_INP`;
				const template = params?.template ?? defaultParams.template ?? context.templates.input;
				let isDispose = false;

				const componentRef = ref<
					InstanceType<VueInputComponent> | null
				>(null);

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

				const check = async() => {
					const result = componentRef.value?.check?.() || DEither.success(modelValue.value);

					if (params.dataStructure === undefined || DEither.isLeft(result)) {
						return result;
					}

					const value = DEither.unwrapRight(result);

					const structureCheckResult = await params.dataStructure.asyncParse(
						value,
						params.codecs ?? defaultParams.codecs ?? context.codecs,
					);

					if (DEither.isLeft(structureCheckResult)) {
						const dataStructureError = DEither.unwrapLeft(structureCheckResult)!;
						errorMessage.value = getDataStructureErrorMessage(dataStructureError);

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

					return DEither.success(DEither.unwrapRight(structureCheckResult));
				};

				const reset = () => {
					componentRef.value?.reset?.();
					errorMessage.value = null;
				};

				const dispose = () => {
					scope.stop();
					isDispose = true;
					componentRef.value?.dispose?.();
				};

				const getCurrentValue = () => modelValue.value;

				const getInputVNode = () => h(
					inputComponent,
					{
						...defaultParams.props,
						...getLocalProps(),
						modelValue: modelValue.value,
						"onUpdate:modelValue": (value: any) => {
							if (isDispose) {
								return;
							}

							modelValue.value = value;
						},
						id: key,
						key,
						ref: componentRef,
					},
				);

				const getErrorMessage = params.dataStructure && (() => errorMessage.value);

				const getVNode = () => template.getVNode(
					{
						getLabel,
						fieldKey: key,
						getCurrentValue,
						getErrorMessage,
						class: params.class,
					},
					{
						input: getInputVNode,
					},
				);

				return {
					check,
					reset,
					dispose,
					getVNode,
				};
			},
			defaultValue,
		);
	};
}
