import { GetFormFieldSlots, FormField, GetFormFieldCheckedValue, GetFormFieldValue } from '../formField';
export interface UseDisabledLayoutParams {
    isDisabled(): boolean;
}
export declare function useDisabledLayout<GenericFormField extends FormField>(formField: GenericFormField, params: UseDisabledLayoutParams): FormField<GetFormFieldValue<GenericFormField>, GetFormFieldCheckedValue<GenericFormField> | undefined, GetFormFieldSlots<GenericFormField>>;
