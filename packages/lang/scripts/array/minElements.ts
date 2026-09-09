import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ComputeMinElementsCompatibility, ExtractLengthEqual, ExtractMaxElements, IsImpossibleToApplyMinElements, LengthEqual, MaxElements, MinElements } from "./constraints";

type RequireLengthEqualConstraint<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<InferredLength, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinElements<${GenericMin}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMaxElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredMax>
	? DNumber.IsGreaterOrEqual<InferredMax, GenericMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MinElements<${GenericMin}> on MaxElements<${InferredMax}>.`
		>
	: unknown;

type RequireApplyMinElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMin>
	& DNumber.RequireSimpleLiteral<GenericMin>
	& RequireLengthEqualConstraint<GenericArray, GenericMin>
	& RequireMaxElementsConstraint<GenericArray, GenericMin>
);

type RequireApplyMinElementsBoolean<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = DCommon.IsEqual<GenericMin, number> extends true
	? unknown
	: RequireApplyMinElements<GenericArray, GenericMin>;

type MinElementsOutput<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = GenericArray extends unknown
	? IsImpossibleToApplyMinElements<GenericArray, MinElements<GenericMin>> extends true
		? never
		: ComputeMinElementsCompatibility<
			GenericArray,
			MinElements<GenericMin>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericArray
				: GenericArray & MinElements<GenericMin>
			: never
	: never;

export function minElements<
	GenericArray extends readonly unknown[],
	const GenericMin extends number,
>(
	min: GenericMin & RequireApplyMinElements<GenericArray, GenericMin>,
): (
	array: GenericArray,
) => array is MinElementsOutput<GenericArray, GenericMin>;

export function minElements<
	GenericArray extends readonly unknown[],
	const GenericMin extends number,
>(
	min: GenericMin & RequireApplyMinElementsBoolean<GenericArray, GenericMin>,
): (
	array: GenericArray,
) => boolean;

export function minElements<
	GenericArray extends readonly unknown[],
	const GenericMin extends number,
>(
	array: GenericArray,
	min: GenericMin & RequireApplyMinElements<GenericArray, GenericMin>,
): array is MinElementsOutput<GenericArray, GenericMin>;

export function minElements<
	GenericArray extends readonly unknown[],
	const GenericMin extends number,
>(
	array: GenericArray,
	min: GenericMin & RequireApplyMinElementsBoolean<GenericArray, GenericMin>,
): boolean;

export function minElements(
	...args:
		| [min: number]
		| [array: readonly unknown[], min: number]
): any {
	if (args.length === 1) {
		const [min] = args;

		return (array: readonly unknown[]) => minElements(array, min as never);
	}

	const [array, min] = args;

	return array.length >= min;
}
