import * as DKind from "@scripts/kind";
import type { Left } from "./create";
import { isLeft } from "./is";
import { createKind, valueKind } from "../kind";
import type { GetValue } from "../types";

export class NotLeftError extends DKind.parentClass(
	createKind("not-left-error"),
	Error,
) {
	public constructor(
		public value: unknown,
	) {
		super(undefined, "Value is not Left.");
	}
}

export function unwrapLeftOrThrow<
	GenericInput extends unknown,
>(
	input: GenericInput,
): GetValue<Extract<GenericInput, Left>>;

export function unwrapLeftOrThrow(
	input: unknown,
) {
	if (isLeft(input)) {
		return valueKind.getValue(input);
	}

	throw new NotLeftError(input);
}
