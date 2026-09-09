import type * as DCommon from "@scripts/common";
import { isMatch } from "./isMatch";
import { SymbolToolPatternFunctionLabel, type Pattern, type ToolPattern } from "./types";

const SymbolToolPatternFunction = Symbol.for(SymbolToolPatternFunctionLabel);

export function union<
	GenericInput extends unknown,
	const GenericPatterns extends readonly [
		Pattern<GenericInput extends infer InferredInput ? InferredInput : never>,
		...Pattern<GenericInput extends infer InferredInput ? InferredInput : never>[],
	],
>(
	...patterns: DCommon.FixDeepFunctionInfer<
		readonly [Pattern<GenericInput>, ...Pattern<GenericInput>[]],
		GenericPatterns
	>
): ToolPattern<
	GenericInput,
	GenericPatterns[number] extends infer InferredPattern
		? InferredPattern
		: never
> {
	return {
		[SymbolToolPatternFunction]: (
			input: GenericInput,
		) => {
			for (const pattern of patterns) {
				if (isMatch(input as never, pattern as never)) {
					return true;
				}
			}

			return false;
		},
	} as never;
}
