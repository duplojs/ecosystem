import type * as DCommon from "@scripts/common";
import type { ComputeGreaterThanOrEqualCompatibility, ComputeLessThanOrEqualCompatibility, GreaterThanOrEqual, IsImpossibleToApplyGreaterThanOrEqual, IsImpossibleToApplyLessThanOrEqual, LessThanOrEqual } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

type ApplyGreaterThanOrEqual<
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

type ApplyLessThanOrEqual<
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

type BetweenThanOrEqualOutput<
	GenericValue extends number,
	GenericGreater extends number,
	GenericLess extends number,
> = ApplyLessThanOrEqual<
	ApplyGreaterThanOrEqual<GenericValue, GenericGreater>,
	GenericLess
>;

type RequireApplyBetweenThanOrEqual<
	GenericNumber extends number,
> = RequireSimpleLiteral<GenericNumber>;

type RequireApplyBetweenThanOrEqualBoolean<
	GenericNumber extends number,
> = DCommon.IsEqual<GenericNumber, number> extends true
	? unknown
	: RequireApplyBetweenThanOrEqual<GenericNumber>;

export function betweenThanOrEqual<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	greater: GenericGreater & RequireApplyBetweenThanOrEqual<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThanOrEqual<GenericLess>,
): (
	value: GenericValue,
) => value is BetweenThanOrEqualOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThanOrEqual<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	greater: GenericGreater & RequireApplyBetweenThanOrEqualBoolean<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThanOrEqualBoolean<GenericLess>,
): (
	value: GenericValue,
) => boolean;

export function betweenThanOrEqual<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	value: GenericValue,
	greater: GenericGreater & RequireApplyBetweenThanOrEqual<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThanOrEqual<GenericLess>,
): value is BetweenThanOrEqualOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThanOrEqual<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	value: GenericValue,
	greater: GenericGreater & RequireApplyBetweenThanOrEqualBoolean<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThanOrEqualBoolean<GenericLess>,
): boolean;

export function betweenThanOrEqual(
	...args:
		| [greater: number, less: number]
		| [value: number, greater: number, less: number]
): any {
	if (args.length === 2) {
		const [greater, less] = args;

		return (value: number) => betweenThanOrEqual(value, greater as never, less as never);
	}

	const [value, greater, less] = args;

	return value >= greater && value <= less;
}
