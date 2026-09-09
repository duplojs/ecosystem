import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ComputeLengthEqualCompatibility, ExtractLengthEqual, ExtractMaxCharacters, ExtractMinCharacters, IsImpossibleToApplyLengthEqual, LengthEqual, MaxCharacters, MinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericLength extends number,
> = ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
	? DCommon.IsEqual<GenericLength, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinCharactersConstraint<
	GenericString extends string,
	GenericLength extends number,
> = ExtractMinCharacters<GenericString, unknown> extends MinCharacters<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericLength, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MinCharacters<${InferredMin}>.`
		>
	: unknown;

type RequireMaxCharactersConstraint<
	GenericString extends string,
	GenericLength extends number,
> = ExtractMaxCharacters<GenericString, unknown> extends MaxCharacters<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MaxCharacters<${InferredMax}>.`
		>
	: unknown;

type RequireApplyLengthEqual<
	GenericString extends string,
	GenericLength extends number,
> = (
	& DNumber.ForbiddenNegative<GenericLength>
	& DNumber.RequireSimpleLiteral<GenericLength>
	& RequireLengthEqualConstraint<GenericString, GenericLength>
	& RequireMinCharactersConstraint<GenericString, GenericLength>
	& RequireMaxCharactersConstraint<GenericString, GenericLength>
);

type RequireApplyLengthEqualBoolean<
	GenericString extends string,
	GenericLength extends number,
> = DCommon.IsEqual<GenericLength, number> extends true
	? unknown
	: RequireApplyLengthEqual<GenericString, GenericLength>;

type LengthEqualOutput<
	GenericString extends string,
	GenericLength extends number,
> = GenericString extends unknown
	? IsImpossibleToApplyLengthEqual<GenericString, LengthEqual<GenericLength>> extends true
		? never
		: ComputeLengthEqualCompatibility<
			GenericString,
			LengthEqual<GenericLength>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericString
				: GenericString & LengthEqual<GenericLength>
			: never
	: never;

export function lengthEqual<
	GenericString extends string,
	const GenericLength extends number,
>(
	length: GenericLength & RequireApplyLengthEqual<GenericString, GenericLength>,
): (
	string: GenericString,
) => string is LengthEqualOutput<GenericString, GenericLength>;

export function lengthEqual<
	GenericString extends string,
	const GenericLength extends number,
>(
	length: GenericLength & RequireApplyLengthEqualBoolean<GenericString, GenericLength>,
): (
	string: GenericString,
) => boolean;

export function lengthEqual<
	GenericString extends string,
	const GenericLength extends number,
>(
	string: GenericString,
	length: GenericLength & RequireApplyLengthEqual<GenericString, GenericLength>,
): string is LengthEqualOutput<GenericString, GenericLength>;

export function lengthEqual<
	GenericString extends string,
	const GenericLength extends number,
>(
	string: GenericString,
	length: GenericLength & RequireApplyLengthEqualBoolean<GenericString, GenericLength>,
): boolean;

export function lengthEqual(
	...args:
		| [length: number]
		| [string: string, length: number]
): any {
	if (args.length === 1) {
		const [length] = args;

		return (string: string) => lengthEqual(string, length as never);
	}

	const [string, length] = args;

	return string.length === length;
}
