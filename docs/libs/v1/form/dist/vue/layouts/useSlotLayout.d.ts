import { GetFormFieldSlots, FormField, GetFormFieldCheckedValue, GetFormFieldValue, FormFieldSlotParams } from '../formField';
import type * as DCommon from "@duplojs-v1/lang/common";
export type SlotPrimitiveDefaultValue = null | string | undefined | boolean | bigint | number;
export type SlotDefaultValue = SlotPrimitiveDefaultValue | (() => object | SlotPrimitiveDefaultValue);
export interface UseSlotLayoutParams<GenericDefaultValue extends SlotDefaultValue = SlotDefaultValue> {
    defaultValue: GenericDefaultValue;
}
type ComputeSlotValue<GenericDefaultValue extends SlotDefaultValue = SlotDefaultValue> = GenericDefaultValue extends DCommon.AnyFunction ? ReturnType<GenericDefaultValue> : GenericDefaultValue;
export declare function useSlotLayout<GenericName extends string, GenericFormField extends FormField>(name: GenericName, formField: GenericFormField): FormField<GetFormFieldValue<GenericFormField>, GetFormFieldCheckedValue<GenericFormField> | undefined, DCommon.SimplifyTopLevel<GetFormFieldSlots<GenericFormField> & {
    [Prop in GenericName]: DCommon.SimplifyTopLevel<Omit<FormFieldSlotParams<GetFormFieldValue<GenericFormField>>, "formField"> & {
        formField(): any;
    }>;
}>>;
export declare function useSlotLayout<GenericName extends string, GenericDefaultValue extends SlotDefaultValue>(name: GenericName, params: UseSlotLayoutParams<GenericDefaultValue>): FormField<ComputeSlotValue<GenericDefaultValue>, ComputeSlotValue<GenericDefaultValue>, DCommon.SimplifyTopLevel<{
    [Prop in GenericName]: DCommon.SimplifyTopLevel<Omit<FormFieldSlotParams<ComputeSlotValue<GenericDefaultValue>>, "formField">>;
}>>;
export {};
