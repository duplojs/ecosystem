import type * as DCommon from "@scripts/common";
import type { ComputeLessThanCompatibility, IsImpossibleToApplyLessThan, LessThan } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

type LessThanOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? IsImpossibleToApplyLessThan<GenericValue, LessThan<GenericThreshold>> extends true
		? never
		: ComputeLessThanCompatibility<
			GenericValue,
			LessThan<GenericThreshold>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericValue
				: GenericValue & LessThan<GenericThreshold>
			: never
	: never;

type RequireApplyLessThan<
	GenericThreshold extends number,
> = RequireSimpleLiteral<GenericThreshold>;

type RequireApplyLessThanBoolean<
	GenericThreshold extends number,
> = DCommon.IsEqual<GenericThreshold, number> extends true
	? unknown
	: RequireApplyLessThan<GenericThreshold>;

export function lessThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyLessThan<GenericThreshold>,
): (
	value: GenericValue,
) => value is LessThanOutput<GenericValue, GenericThreshold>;

export function lessThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyLessThanBoolean<GenericThreshold>,
): (
	value: GenericValue,
) => boolean;

export function lessThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyLessThan<GenericThreshold>,
): value is LessThanOutput<GenericValue, GenericThreshold>;

export function lessThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyLessThanBoolean<GenericThreshold>,
): boolean;

export function lessThan(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => lessThan(value, threshold as never);
	}

	const [value, threshold] = args;

	return value < threshold;
}
