import type * as DCommon from "@duplojs/lang/common";
import type * as DArray from "@duplojs/lang/array";
import type * as DKind from "@duplojs/lang/kind";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DEither from "@duplojs/lang/either";
import { createKind } from "./kind";
import type { Ref, VNode } from "vue";
import type { Templates } from "./template";

export interface FormFieldSlotParams<
	GenericValue extends unknown = unknown,
> {
	fieldKey: string;
	value: GenericValue;
	update(value: GenericValue): void;
	formField?(): VNode | null;
}

export type FormFieldSlots = Record<
	string,
	FormFieldSlotParams
>;

export interface FormFieldInstanceContext {
	templates: Templates;
	getSlot(
		name: string,
		params: FormFieldSlotParams,
	): VNode | null;
	errorInterpreter: DDataStructure.ErrorInterpreter;
	codecs: DDataStructure.Codecs | undefined;
}

export type FormFieldInstanceParams<
	GenericValue extends unknown = unknown,
> = [
	modelValue: Ref<GenericValue>,
	parentKey: string,
	context: FormFieldInstanceContext,
];

export interface ErrorProperties {
	key: string;
	dataStructureError?: DDataStructure.Error;
}

export type DetailsError = readonly ErrorProperties[] & DArray.MinElements<1>;

export interface FormFieldInstance<
	GenericCheckedValue extends unknown = unknown,
> {
	check(): Promise<DEither.Error<DetailsError> | DEither.Success<GenericCheckedValue>>;
	reset(): void;
	dispose(): void;
	getVNode(): VNode | null;
}

export interface FormFieldProperties<
	GenericValue extends unknown = unknown,
	GenericCheckedValue extends unknown = unknown,
	GenericSlots extends FormFieldSlots = FormFieldSlots,
> {
	value: GenericValue;
	checkedValue: GenericCheckedValue;
	slots: GenericSlots;
}

export const formFieldKind = createKind<
	"form-field",
	FormFieldProperties
>("form-field");

export interface FormField<
	GenericValue extends unknown = unknown,
	GenericCheckedValue extends unknown = unknown,
	GenericSlots extends FormFieldSlots = FormFieldSlots,
> extends DKind.Kind<
		typeof formFieldKind,
		FormFieldProperties<
			GenericValue,
			GenericCheckedValue,
			GenericSlots
		>
	> {
	"new"(
		...args: FormFieldInstanceParams<GenericValue>
	): FormFieldInstance<GenericCheckedValue>;
	readonly defaultValue: GenericValue;
}

export function createFormField<
	GenericValue extends unknown,
	GenericCheckedValue extends unknown,
	GenericSlots extends FormFieldSlots,
>(
	theFunction: (
		...args: FormFieldInstanceParams<GenericValue>
	) => FormFieldInstance<
		GenericCheckedValue
	>,
	defaultValue: NoInfer<GenericValue>,
): FormField<
	GenericValue,
	GenericCheckedValue,
	GenericSlots
> {
	return formFieldKind.setTo(
		{
			new: theFunction,
			defaultValue,
		},
		{} as any,
	);
}

export type GetFormFieldValue<
	GenericFormField extends FormField,
> = GenericFormField extends FormField<infer InferredValue>
	? InferredValue
	: never;

export type GetFormFieldCheckedValue<
	GenericFormField extends FormField,
> = GenericFormField extends FormField<any, infer InferredCheckedValue>
	? InferredCheckedValue
	: never;

export type GetFormFieldSlots<
	GenericFormField extends FormField,
> = GenericFormField extends FormField<any, any, infer InferredSlots>
	? InferredSlots
	: never;

export type MergeFormFieldSlots<
	GenericFormField extends FormField,
> = Extract<
	keyof DCommon.UnionToIntersection<GetFormFieldSlots<GenericFormField>> extends infer InferredKeyof extends string
		? {
			[Prop in InferredKeyof]: Extract<
				GetFormFieldSlots<GenericFormField>,
				Record<Prop, unknown>
			>[Prop]
		}
		: never,
	FormFieldSlots
>;
