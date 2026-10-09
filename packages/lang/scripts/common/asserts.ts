import { DuploJSError } from "./error";

export class AssertsError extends DuploJSError.parentClass("common-asserts-error") {
	public constructor(
		public value: unknown,
	) {
		super("Asserts Error.");
	}
}

export function asserts<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	input: GenericInput,
	predicate: (input: GenericInput) => input is GenericPredicate,
): asserts input is GenericPredicate {
	if (!predicate(input)) {
		throw new AssertsError(input);
	}
}
