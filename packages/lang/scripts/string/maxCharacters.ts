import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ComputeMaxCharactersCompatibility, ExtractLengthEqual, ExtractMinCharacters, IsImpossibleToApplyMaxCharacters, LengthEqual, MaxCharacters, MinCharacters } from "./constraints";

type RequireLengthEqualConstraint<
	GenericString extends string,
	GenericMax extends number,
> = ExtractLengthEqual<GenericString, unknown> extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxCharacters<${GenericMax}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinCharactersConstraint<
	GenericString extends string,
	GenericMax extends number,
> = ExtractMinCharacters<GenericString, unknown> extends MinCharacters<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxCharacters<${GenericMax}> on MinCharacters<${InferredMin}>.`
		>
	: unknown;

type RequireApplyMaxCharacters<
	GenericString extends string,
	GenericMax extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMax>
	& DNumber.RequireSimpleLiteral<GenericMax>
	& RequireLengthEqualConstraint<GenericString, GenericMax>
	& RequireMinCharactersConstraint<GenericString, GenericMax>
);

type RequireApplyMaxCharactersBoolean<
	GenericString extends string,
	GenericMax extends number,
> = DCommon.IsEqual<GenericMax, number> extends true
	? unknown
	: RequireApplyMaxCharacters<GenericString, GenericMax>;

type MaxCharactersOutput<
	GenericString extends string,
	GenericMax extends number,
> = GenericString extends unknown
	? IsImpossibleToApplyMaxCharacters<GenericString, MaxCharacters<GenericMax>> extends true
		? never
		: ComputeMaxCharactersCompatibility<
			GenericString,
			MaxCharacters<GenericMax>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericString
				: GenericString & MaxCharacters<GenericMax>
			: never
	: never;

export function maxCharacters<
	GenericString extends string,
	const GenericMax extends number,
>(
	max: GenericMax & RequireApplyMaxCharacters<GenericString, GenericMax>,
): (
	string: GenericString,
) => string is MaxCharactersOutput<GenericString, GenericMax>;

export function maxCharacters<
	GenericString extends string,
	const GenericMax extends number,
>(
	max: GenericMax & RequireApplyMaxCharactersBoolean<GenericString, GenericMax>,
): (
	string: GenericString,
) => boolean;

export function maxCharacters<
	GenericString extends string,
	const GenericMax extends number,
>(
	string: GenericString,
	max: GenericMax & RequireApplyMaxCharacters<GenericString, GenericMax>,
): string is MaxCharactersOutput<GenericString, GenericMax>;

export function maxCharacters<
	GenericString extends string,
	const GenericMax extends number,
>(
	string: GenericString,
	max: GenericMax & RequireApplyMaxCharactersBoolean<GenericString, GenericMax>,
): boolean;

export function maxCharacters(
	...args:
		| [max: number]
		| [string: string, max: number]
): any {
	if (args.length === 1) {
		const [max] = args;

		return (string: string) => maxCharacters(string, max as never);
	}

	const [string, max] = args;

	return string.length <= max;
}
