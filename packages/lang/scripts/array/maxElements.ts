import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type { ComputeMaxElementsCompatibility, ExtractLengthEqual, ExtractMinElements, IsImpossibleToApplyMaxElements, LengthEqual, MaxElements, MinElements } from "./constraints";

type RequireLengthEqualConstraint<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredLength> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxElements<${GenericMax}> on LengthEqual<${InferredLength}>.`
		>
	: unknown;

type RequireMinElementsConstraint<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin>
	? DNumber.IsGreaterOrEqual<GenericMax, InferredMin> extends true
		? unknown
		: DCommon.ComputedTypeError<
			`Cannot apply MaxElements<${GenericMax}> on MinElements<${InferredMin}>.`
		>
	: unknown;

type RequireApplyMaxElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = (
	& DNumber.ForbiddenNegative<GenericMax>
	& DNumber.RequireSimpleLiteral<GenericMax>
	& RequireLengthEqualConstraint<GenericArray, GenericMax>
	& RequireMinElementsConstraint<GenericArray, GenericMax>
);

type RequireApplyMaxElementsBoolean<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = DCommon.IsEqual<GenericMax, number> extends true
	? unknown
	: RequireApplyMaxElements<GenericArray, GenericMax>;

type MaxElementsOutput<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = GenericArray extends unknown
	? IsImpossibleToApplyMaxElements<GenericArray, MaxElements<GenericMax>> extends true
		? never
		: ComputeMaxElementsCompatibility<
			GenericArray,
			MaxElements<GenericMax>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericArray
				: GenericArray & MaxElements<GenericMax>
			: never
	: never;

export function maxElements<
	GenericArray extends readonly unknown[],
	const GenericMax extends number,
>(
	max: GenericMax & RequireApplyMaxElements<GenericArray, GenericMax>,
): (
	array: GenericArray,
) => array is MaxElementsOutput<GenericArray, GenericMax>;

export function maxElements<
	GenericArray extends readonly unknown[],
	const GenericMax extends number,
>(
	max: GenericMax & RequireApplyMaxElementsBoolean<GenericArray, GenericMax>,
): (
	array: GenericArray,
) => boolean;

export function maxElements<
	GenericArray extends readonly unknown[],
	const GenericMax extends number,
>(
	array: GenericArray,
	max: GenericMax & RequireApplyMaxElements<GenericArray, GenericMax>,
): array is MaxElementsOutput<GenericArray, GenericMax>;

export function maxElements<
	GenericArray extends readonly unknown[],
	const GenericMax extends number,
>(
	array: GenericArray,
	max: GenericMax & RequireApplyMaxElementsBoolean<GenericArray, GenericMax>,
): boolean;

export function maxElements(
	...args:
		| [max: number]
		| [array: readonly unknown[], max: number]
): any {
	if (args.length === 1) {
		const [max] = args;

		return (array: readonly unknown[]) => maxElements(array, max as never);
	}

	const [array, max] = args;

	return array.length <= max;
}
