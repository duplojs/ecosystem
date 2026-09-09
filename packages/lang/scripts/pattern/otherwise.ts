import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { patternResultKind } from "./kind";
import { isResult, type PatternResult } from "./result";

export function otherwise<
	GenericInput extends DCommon.AnyValue,
	GenericInputValue extends Exclude<GenericInput, PatternResult>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	GenericOutput extends DCommon.AnyValue,
>(
	theFunction: (rest: GenericInputValue) => GenericOutput,
): (
	input: GenericInput | GenericInputPatternResult | GenericInputValue,
) => (
	| GenericOutput
	| DKind.GetValue<typeof patternResultKind, GenericInputPatternResult>
);

export function otherwise<
	GenericInput extends DCommon.AnyValue,
	GenericInputValue extends Exclude<GenericInput, PatternResult>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	GenericOutput extends DCommon.AnyValue,
>(
	input: GenericInput | GenericInputPatternResult | GenericInputValue,
	theFunction: (rest: GenericInputValue) => GenericOutput,
): (
	| GenericOutput
	| DKind.GetValue<typeof patternResultKind, GenericInputPatternResult>
);

export function otherwise(
	...args:
		| [theFunction: DCommon.AnyFunction]
		| [input: unknown, theFunction: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [theFunction] = args;
		return (input: unknown) => otherwise(input, theFunction);
	}

	const [input, theFunction] = args;

	return isResult(input)
		? patternResultKind.getValue(input) as never
		: theFunction(input) as never;
}
