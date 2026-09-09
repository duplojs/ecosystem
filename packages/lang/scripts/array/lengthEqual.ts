import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ComputeLengthEqualCompatibility, ExtractLengthEqual, ExtractMaxElements, ExtractMinElements, IsImpossibleToApplyLengthEqual, LengthEqual, MaxElements, MinElements } from "./constraints";

type RequireLengthEqualConstraint<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
	? DCommon.IsEqual<GenericLength, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericLength, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MinElements<${InferredMin}>.`
		>
	: unknown;

type RequireMaxElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply LengthEqual<${GenericLength}> on MaxElements<${InferredMax}>.`
		>
	: unknown;

type RequireApplyLengthEqual<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = (
	& DNumber.ForbiddenNegative<GenericLength>
	& DNumber.RequireSimpleLiteral<GenericLength>
	& RequireLengthEqualConstraint<GenericArray, GenericLength>
	& RequireMinElementsConstraint<GenericArray, GenericLength>
	& RequireMaxElementsConstraint<GenericArray, GenericLength>
);

type RequireApplyLengthEqualBoolean<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = DCommon.IsEqual<GenericLength, number> extends true
	? unknown
	: RequireApplyLengthEqual<GenericArray, GenericLength>;

type LengthEqualOutput<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = GenericArray extends unknown
	? IsImpossibleToApplyLengthEqual<GenericArray, LengthEqual<GenericLength>> extends true
		? never
		: ComputeLengthEqualCompatibility<
			GenericArray,
			LengthEqual<GenericLength>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericArray
				: GenericArray & LengthEqual<GenericLength>
			: never
	: never;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	const GenericLength extends number,
>(
	length: GenericLength & RequireApplyLengthEqual<GenericArray, GenericLength>,
): (
	array: GenericArray,
) => array is LengthEqualOutput<GenericArray, GenericLength>;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	const GenericLength extends number,
>(
	length: GenericLength & RequireApplyLengthEqualBoolean<GenericArray, GenericLength>,
): (
	array: GenericArray,
) => boolean;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	const GenericLength extends number,
>(
	array: GenericArray,
	length: GenericLength & RequireApplyLengthEqual<GenericArray, GenericLength>,
): array is LengthEqualOutput<GenericArray, GenericLength>;

export function lengthEqual<
	GenericArray extends readonly unknown[],
	const GenericLength extends number,
>(
	array: GenericArray,
	length: GenericLength & RequireApplyLengthEqualBoolean<GenericArray, GenericLength>,
): boolean;

export function lengthEqual(
	...args:
		| [length: number]
		| [array: readonly unknown[], length: number]
): any {
	if (args.length === 1) {
		const [length] = args;

		return (array: readonly unknown[]) => lengthEqual(array, length as never);
	}

	const [array, length] = args;

	return array.length === length;
}
