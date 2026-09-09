import * as DKind from "@scripts/kind";
import { createKind } from "./kind";

export class AssertsError extends DKind.parentClass(
	createKind("asserts-error"),
	Error,
) {
	public constructor(
		public value: unknown,
	) {
		super(undefined, "Asserts Error.");
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
