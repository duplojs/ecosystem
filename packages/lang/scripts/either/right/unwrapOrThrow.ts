import * as DCommon from "@scripts/common";
import type { Right } from "./create";
import { isRight } from "./is";
import { valueKind } from "../kind";
import type { GetValue } from "../types";

export class NotRightError extends DCommon.DuploJSError.parentClass("either-not-right-error") {
	public constructor(
		public value: unknown,
	) {
		super("Value is not Right.");
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
