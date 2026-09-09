import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type * as DArray from "@scripts/array";
import type * as DTuple from "@scripts/tuple";
import type { ApplyFormat, Format } from "./constraints";
import type { IsKeyPattern } from "./types";

export interface SplitParams<
	GenericLimit extends number,
> {
	limit: GenericLimit & DNumber.RequirePositiveInteger<GenericLimit>;
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
> = DCommon.IsEqual<GenericLimit, number> extends true
	? GenericGroupNumber
	: DTuple.Create<unknown, GenericGroupNumber> extends readonly [
		...DTuple.Create<unknown, GenericLimit>,
		...unknown[],
	]
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
	? string[] & DArray.MinElements<ApplySplitLimit<1, GenericLimit>>
	: CountSplitGroups<
		GenericString,
		GenericSeparator
	> extends infer InferredGroupNumber extends number
		? ApplySplitLimit<
			InferredGroupNumber,
			GenericLimit
		> extends infer InferredOutputLength extends number
			? (
				& string[]
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
	GenericSeparator extends string,
	GenericLimit extends number = number,
> = GenericString extends Format<string>
	? ComputeSplitOutput<
		Extract<DCommon.RemoveConstraint<ApplyFormat<GenericString>>, string>,
		GenericSeparator,
		GenericLimit
	>
	: ComputeSplitOutput<
		Extract<DCommon.RemoveConstraint<GenericString>, string>,
		GenericSeparator, GenericLimit
	>;

export function split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericOutput = SplitOutput<GenericString, GenericSeparator>,
>(
	separator: GenericSeparator | RegExp,
): (
	string: GenericString,
) => DCommon.BreakGenericLink<GenericOutput>;

export function split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number,
	GenericOutput = SplitOutput<GenericString, GenericSeparator, GenericLimit>,
>(
	string: GenericString,
	separator: GenericSeparator | RegExp,
	params?: SplitParams<GenericLimit>,
): DCommon.BreakGenericLink<GenericOutput>;

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

	return string.split(separator, params?.limit);
}
