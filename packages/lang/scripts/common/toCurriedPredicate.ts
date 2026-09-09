export function toCurriedPredicate<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	predicate: (input: GenericInput) => input is GenericPredicate,
): (input: GenericInput) => input is GenericPredicate;

export function toCurriedPredicate<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	predicate: (input: GenericInput) => input is GenericPredicate,
): (input: GenericInput) => input is GenericPredicate {
	return (input) => predicate(input);
}
