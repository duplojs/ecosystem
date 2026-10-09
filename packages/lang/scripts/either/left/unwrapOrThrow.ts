import * as DCommon from "@scripts/common";
import type { Left } from "./create";
import { isLeft } from "./is";
import { valueKind } from "../kind";
import type { GetValue } from "../types";

export class NotLeftError extends DCommon.DuploJSError.parentClass("either-not-left-error") {
	public constructor(
		public value: unknown,
	) {
		super("Value is not Left.");
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
