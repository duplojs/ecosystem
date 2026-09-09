import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ComputeMinCharactersCompatibility, ExtractLengthEqual, ExtractMaxCharacters, LengthEqual, MaxCharacters, MinCharacters, IsImpossibleToApplyMinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericMin extends number,
> = ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinCharacters<${GenericMin}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMaxCharactersConstraint<
	GenericString extends string,
	GenericMin extends number,
> = ExtractMaxCharacters<GenericString, unknown> extends MaxCharacters<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinCharacters<${GenericMin}> on MaxCharacters<${InferredMax}>.`
		>
	: unknown;

type RequireApplyMinCharacters<
	GenericString extends string,
	GenericMin extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMin>
	& DNumber.RequireSimpleLiteral<GenericMin>
	& RequireLengthEqualConstraint<GenericString, GenericMin>
	& RequireMaxCharactersConstraint<GenericString, GenericMin>
);

type RequireApplyMinCharactersBoolean<
	GenericString extends string,
	GenericMin extends number,
> = DCommon.IsEqual<GenericMin, number> extends true
	? unknown
	: RequireApplyMinCharacters<GenericString, GenericMin>;

type MinCharactersOutput<
	GenericString extends string,
	GenericMin extends number,
> = GenericString extends unknown
	? IsImpossibleToApplyMinCharacters<GenericString, MinCharacters<GenericMin>> extends true
		? never
		: ComputeMinCharactersCompatibility<
			GenericString,
			MinCharacters<GenericMin>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericString
				: GenericString & MinCharacters<GenericMin>
			: never
	: never;

export function minCharacters<
	GenericString extends string,
	const GenericMin extends number,
>(
	min: GenericMin & RequireApplyMinCharacters<GenericString, GenericMin>,
): (
	string: GenericString,
) => string is MinCharactersOutput<GenericString, GenericMin>;

export function minCharacters<
	GenericString extends string,
	const GenericMin extends number,
>(
	min: GenericMin & RequireApplyMinCharactersBoolean<GenericString, GenericMin>,
): (
	string: GenericString,
) => boolean;

export function minCharacters<
	GenericString extends string,
	const GenericMin extends number,
>(
	string: GenericString,
	min: GenericMin & RequireApplyMinCharacters<GenericString, GenericMin>,
): string is MinCharactersOutput<GenericString, GenericMin>;

export function minCharacters<
	GenericString extends string,
	const GenericMin extends number,
>(
	string: GenericString,
	min: GenericMin & RequireApplyMinCharactersBoolean<GenericString, GenericMin>,
): boolean;

export function minCharacters(
	...args:
		| [min: number]
		| [string: string, min: number]
): any {
	if (args.length === 1) {
		const [min] = args;

		return (string: string) => minCharacters(string, min as never);
	}

	const [string, min] = args;

	return string.length >= min;
}
