import { MultipleOfConstraint } from "../constraint";

export function multipleOf<
	GenericMultiple extends number,
>(multiple: GenericMultiple) {
	return MultipleOfConstraint(multiple);
}
