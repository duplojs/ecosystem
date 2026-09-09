import type * as DCommon from "@scripts/common";
import type { ComputeGreaterThanOrEqualCompatibility, GreaterThanOrEqual, IsImpossibleToApplyGreaterThanOrEqual } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

type GreaterThanOrEqualOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? IsImpossibleToApplyGreaterThanOrEqual<GenericValue, GreaterThanOrEqual<GenericThreshold>> extends true
		? never
		: ComputeGreaterThanOrEqualCompatibility<
			GenericValue,
			GreaterThanOrEqual<GenericThreshold>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericValue
				: GenericValue & GreaterThanOrEqual<GenericThreshold>
			: never
	: never;

type RequireApplyGreaterThanOrEqual<
	GenericThreshold extends number,
> = RequireSimpleLiteral<GenericThreshold>;

type RequireApplyGreaterThanOrEqualBoolean<
	GenericThreshold extends number,
> = DCommon.IsEqual<GenericThreshold, number> extends true
	? unknown
	: RequireApplyGreaterThanOrEqual<GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqual<GenericThreshold>,
): (
	value: GenericValue,
) => value is GreaterThanOrEqualOutput<GenericValue, GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqualBoolean<GenericThreshold>,
): (
	value: GenericValue,
) => boolean;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqual<GenericThreshold>,
): value is GreaterThanOrEqualOutput<GenericValue, GenericThreshold>;

export function greaterThanOrEqual<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThanOrEqualBoolean<GenericThreshold>,
): boolean;

export function greaterThanOrEqual(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => greaterThanOrEqual(value, threshold as never);
	}

	const [value, threshold] = args;

	return value >= threshold;
}
