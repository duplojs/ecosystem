import type * as DCommon from "@scripts/common";
import type { ComputeGreaterThanCompatibility, ComputeLessThanCompatibility, GreaterThan, IsImpossibleToApplyGreaterThan, IsImpossibleToApplyLessThan, LessThan } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

type ApplyGreaterThan<
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

type ApplyLessThan<
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

type BetweenThanOutput<
	GenericValue extends number,
	GenericGreater extends number,
	GenericLess extends number,
> = ApplyLessThan<
	ApplyGreaterThan<GenericValue, GenericGreater>,
	GenericLess
>;

type RequireApplyBetweenThan<
	GenericNumber extends number,
> = RequireSimpleLiteral<GenericNumber>;

type RequireApplyBetweenThanBoolean<
	GenericNumber extends number,
> = DCommon.IsEqual<GenericNumber, number> extends true
	? unknown
	: RequireApplyBetweenThan<GenericNumber>;

export function betweenThan<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	greater: GenericGreater & RequireApplyBetweenThan<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThan<GenericLess>,
): (
	value: GenericValue,
) => value is BetweenThanOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThan<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	greater: GenericGreater & RequireApplyBetweenThanBoolean<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThanBoolean<GenericLess>,
): (
	value: GenericValue,
) => boolean;

export function betweenThan<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	value: GenericValue,
	greater: GenericGreater & RequireApplyBetweenThan<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThan<GenericLess>,
): value is BetweenThanOutput<GenericValue, GenericGreater, GenericLess>;

export function betweenThan<
	GenericValue extends number,
	const GenericGreater extends number,
	const GenericLess extends number,
>(
	value: GenericValue,
	greater: GenericGreater & RequireApplyBetweenThanBoolean<GenericGreater>,
	less: GenericLess & RequireApplyBetweenThanBoolean<GenericLess>,
): boolean;

export function betweenThan(
	...args:
		| [greater: number, less: number]
		| [value: number, greater: number, less: number]
): any {
	if (args.length === 2) {
		const [greater, less] = args;
		return (value: number) => betweenThan(value, greater as never, less as never);
	}

	const [value, greater, less] = args;

	return value > greater && value < less;
}
