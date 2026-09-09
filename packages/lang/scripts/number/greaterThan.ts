import type * as DCommon from "@scripts/common";
import type { ComputeGreaterThanCompatibility, GreaterThan, IsImpossibleToApplyGreaterThan } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

type GreaterThanOutput<
	GenericValue extends number,
	GenericThreshold extends number,
> = GenericValue extends unknown
	? IsImpossibleToApplyGreaterThan<GenericValue, GreaterThan<GenericThreshold>> extends true
		? never
		: ComputeGreaterThanCompatibility<
			GenericValue,
			GreaterThan<GenericThreshold>,
			DCommon.CompatibilityConstraintResult<false, number, number>
		> extends infer InferredResult
			? DCommon.ContainExtends<InferredResult, DCommon.CompatibilityConstraintResult<true>> extends true
				? GenericValue
				: GenericValue & GreaterThan<GenericThreshold>
			: never
	: never;

type RequireApplyGreaterThan<
	GenericThreshold extends number,
> = RequireSimpleLiteral<GenericThreshold>;

type RequireApplyGreaterThanBoolean<
	GenericThreshold extends number,
> = DCommon.IsEqual<GenericThreshold, number> extends true
	? unknown
	: RequireApplyGreaterThan<GenericThreshold>;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThan<GenericThreshold>,
): (
	value: GenericValue,
) => value is GreaterThanOutput<GenericValue, GenericThreshold>;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	threshold: GenericThreshold & RequireApplyGreaterThanBoolean<GenericThreshold>,
): (
	value: GenericValue,
) => boolean;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThan<GenericThreshold>,
): value is GreaterThanOutput<GenericValue, GenericThreshold>;

export function greaterThan<
	GenericValue extends number,
	const GenericThreshold extends number,
>(
	value: GenericValue,
	threshold: GenericThreshold & RequireApplyGreaterThanBoolean<GenericThreshold>,
): boolean;

export function greaterThan(
	...args:
		| [threshold: number]
		| [value: number, threshold: number]
): any {
	if (args.length === 1) {
		const [threshold] = args;

		return (value: number) => greaterThan(value, threshold as never);
	}

	const [value, threshold] = args;

	return value > threshold;
}
