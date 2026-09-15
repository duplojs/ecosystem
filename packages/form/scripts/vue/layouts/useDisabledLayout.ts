import * as DEither from "@duplojs/lang/either";
import { createFormField, type GetFormFieldSlots, type FormField, type GetFormFieldCheckedValue, type GetFormFieldValue } from "@V/formField";

export interface UseDisabledLayoutParams {
	isDisabled(): boolean;
}

export function useDisabledLayout<
	GenericFormField extends FormField,
>(
	formField: GenericFormField,
	params: UseDisabledLayoutParams,
): FormField<
	GetFormFieldValue<GenericFormField>,
	GetFormFieldCheckedValue<GenericFormField> | undefined,
	GetFormFieldSlots<GenericFormField>
>;

export function useDisabledLayout(
	formField: FormField,
	params: UseDisabledLayoutParams,
): FormField {
	return createFormField(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_DIS`;

			const formFieldInstance = formField.new(
				modelValue,
				key,
				context,
			);

			const check = async() => {
				if (params.isDisabled()) {
					return DEither.success(undefined);
				}

				return formFieldInstance.check();
			};

			const reset = () => {
				formFieldInstance.reset();
			};

			const dispose = () => {
				formFieldInstance.dispose();
			};

			const getVNode = () => params.isDisabled()
				? null
				: formFieldInstance.getVNode();

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
