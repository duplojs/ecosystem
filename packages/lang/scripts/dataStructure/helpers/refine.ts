import { RefineConstraint } from "../constraint";

export function refine<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput = GenericInput,
>(
	refine: (
		| ((data: GenericInput) => data is GenericPredicate)
		| ((data: GenericInput) => boolean)
	),
) {
	return RefineConstraint<GenericInput, GenericPredicate>(refine);
}
