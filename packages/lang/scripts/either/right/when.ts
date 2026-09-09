import type * as DCommon from "@scripts/common";
import type { Right } from "./create";
import { isRight } from "./is";
import { valueKind } from "../kind";
import type { GetValue } from "../types";

export function whenIsRight<
	const GenericInput extends unknown,
	const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	theFunction: (
		eitherValue: GetValue<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Right
			>
		>,
	) => GenericOutput,
): (input: GenericInput) => (
	| Exclude<
		DCommon.BreakGenericLink<GenericInput>,
		Right
	>
	| GenericOutput
);

export function whenIsRight<
	const GenericInput extends unknown,
	const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	input: GenericInput,
	theFunction: (
		eitherValue: GetValue<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Right
			>
		>,
	) => GenericOutput,
): (
	| Exclude<GenericInput, Right>
	| GenericOutput
);

export function whenIsRight(
	...args:
		| [input: unknown, theFunction: DCommon.AnyFunction]
		| [theFunction: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [theFunction] = args;

		return (input: unknown) => whenIsRight(
			input,
			theFunction,
		);
	}

	const [input, theFunction] = args;

	if (isRight(input)) {
		return theFunction(valueKind.getValue(input));
	}

	return input;
}
