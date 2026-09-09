import type * as DCommon from "@scripts/common";
import type { ComputeLessThanOrEqualCompatibility, IsImpossibleToApplyLessThanOrEqual, LessThanOrEqual } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

type LessThanOrEqualOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? IsImpossibleToApplyLessThanOrEqual<GenericValue, LessThanOrEqual<GenericThreshold>> extends true
		? never
		: ComputeLessThanOrEqualCompatibility<
			GenericValue,
			LessThanOrEqual<GenericThreshold>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericValue
				: GenericValue & LessThanOrEqual<GenericThreshold>
			: never
	: never;

type RequireApplyLessThanOrEqual<
	GenericThreshold extends number,
> = RequireSimpleLiteral<GenericThreshold>;

type RequireApplyLessThanOrEqualBoolean<
	GenericThreshold extends number,
> = DCommon.IsEqual<GenericThreshold, number> extends true
	? unknown
	: RequireApplyLessThanOrEqual<GenericThreshold>;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyLessThanOrEqual<GenericThreshold>,
): (
	value: GenericValue,
) => value is LessThanOrEqualOutput<GenericValue, GenericThreshold>;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyLessThanOrEqualBoolean<GenericThreshold>,
): (
	value: GenericValue,
) => boolean;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyLessThanOrEqual<GenericThreshold>,
): value is LessThanOrEqualOutput<GenericValue, GenericThreshold>;

export function lessThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyLessThanOrEqualBoolean<GenericThreshold>,
): boolean;

export function lessThanOrEqual(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => lessThanOrEqual(value, threshold as never);
	}

	const [value, threshold] = args;

	return value <= threshold;
}
