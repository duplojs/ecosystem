import * as DKind from "@scripts/kind";
import type { Right } from "./create";
import { isRight } from "./is";
import { createKind, valueKind } from "../kind";
import type { GetValue } from "../types";

export class NotRightError extends DKind.parentClass(
	createKind("not-right-error"),
	Error,
) {
	public constructor(
		public value: unknown,
	) {
		super(undefined, "Value is not Right.");
	}
}

export function unwrapRightOrThrow<
	GenericInput extends unknown,
>(
	input: GenericInput,
): GetValue<Extract<GenericInput, Right>>;

export function unwrapRightOrThrow(
	input: unknown,
) {
	if (isRight(input)) {
		return valueKind.getValue(input);
	}

	throw new NotRightError(input);
}
