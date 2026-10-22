import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";
import * as DArray from "@scripts/array";
import type { ApplyFormat, Format } from "./constraints";
import type { IsKeyPattern } from "./types";

export interface SplitParams<
	GenericLimit extends number,
> {
	limit: GenericLimit;
}

type CountSplitGroups<
	GenericString extends string,
	GenericSeparator extends string,
	GenericGroups extends readonly string[] = [string],
> = GenericString extends `${string}${GenericSeparator}${infer InferredAfter}`
	? DCommon.IsEqual<GenericGroups["length"], 100> extends true
		? number
		: CountSplitGroups<
			InferredAfter,
			GenericSeparator,
			[...GenericGroups, string]
		>
	: GenericGroups["length"];

type ApplySplitLimit<
	GenericGroupNumber extends number,
	GenericLimit extends number,
> = DCommon.IsNever<GenericLimit> extends true
	? GenericGroupNumber
	: GenericLimit extends 0
		? 1
		: DNumber.IsGreaterOrEqual<GenericGroupNumber, GenericLimit> extends true
			? GenericLimit
			: GenericGroupNumber;

type ComputeSplitOutput<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number,
> = DCommon.Or<[
	DCommon.IsEqual<GenericString, string>,
	DCommon.IsEqual<GenericSeparator, "">,
	IsKeyPattern<GenericSeparator>,
]> extends true
	? readonly string[] & DArray.MinElements<ApplySplitLimit<1, GenericLimit>>
	: CountSplitGroups<
		GenericString,
		GenericSeparator
	> extends infer InferredGroupNumber extends number
		? ApplySplitLimit<
			InferredGroupNumber,
			GenericLimit
		> extends infer InferredOutputLength extends number
			? (
				& readonly string[]
				& DArray.MinElements<InferredOutputLength>
				& (
					IsKeyPattern<GenericString> extends true
						? unknown
						: (
							& DArray.LengthEqual<InferredOutputLength>
							& DArray.MaxElements<InferredOutputLength>
						)
				)
			)
			: never
		: never;

type SplitOutput<
	GenericString extends string,
	GenericSeparator extends string | RegExp,
	GenericLimit extends number = never,
> = DCommon.Or<[
	DCommon.ContainExtends<GenericSeparator, RegExp>,
	DCommon.Not<DNumber.IsPositiveInteger<GenericLimit>>,
	DNumber.IsGreater<GenericLimit, 4294967295>,
]> extends true
	? readonly string[] & DArray.MinElements<1>
	: GenericSeparator extends unknown
		? GenericString extends Format<string>
			? ComputeSplitOutput<
				Extract<DCommon.RemoveConstraint<ApplyFormat<GenericString>>, string>,
				Extract<GenericSeparator, string>,
				GenericLimit
			>
			: ComputeSplitOutput<
				Extract<DCommon.RemoveConstraint<GenericString>, string>,
				Extract<GenericSeparator, string>,
				GenericLimit
			>
		: never;

export function split<
	GenericString extends string,
	GenericSeparator extends string | RegExp,
>(
	separator: GenericSeparator,
): (
	string: GenericString,
) => SplitOutput<GenericString, GenericSeparator>;

export function split<
	GenericString extends string,
	GenericSeparator extends string | RegExp,
	GenericLimit extends number = never,
>(
	string: GenericString,
	separator: GenericSeparator,
	params?: SplitParams<GenericLimit>,
): SplitOutput<GenericString, GenericSeparator, GenericLimit>;

export function split(
	...args:
	| [separator: string | RegExp]
	| [string: string, separator: string | RegExp, params?: SplitParams<number>]
): any {
	if (args.length === 1) {
		const [separator] = args;

		return (string: string) => split(string, separator);
	}

	const [string, separator, params] = args;

	const limit = params?.limit;
	const validLimit = DCommon.isType(limit, "number")
		&& DNumber.isPositive(limit)
		&& DNumber.isInteger(limit)
		? limit
		: undefined;
	const result = string.split(separator, validLimit);
	const filteredResult = DCommon.isType(separator, "string")
		? result
		: DArray.filter(result, (value) => value !== undefined);

	return filteredResult.length === 0 ? [""] : filteredResult;
}
