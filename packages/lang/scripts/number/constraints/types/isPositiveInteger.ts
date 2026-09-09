import type * as DCommon from "@scripts/common";
import type { Even } from "../even";
import type { ExtractGreaterThan, GreaterThan } from "../greaterThan";
import type { ExtractGreaterThanOrEqual, GreaterThanOrEqual } from "../greaterThanOrEqual";
import type { Integer } from "../integer";
import type { Odd } from "../odd";
import type { Positive } from "../positive";
import type { StrictPositive } from "../strictPositive";

type IsPositiveLiteral<
	GenericNumber extends number,
> = GenericNumber extends DCommon.BaseConstraint
	? false
	: DCommon.IsEqual<GenericNumber, number> extends true
		? false
		: `${GenericNumber}` extends `-${string}`
			? false
			: true;

type IsIntegerLiteral<
	GenericNumber extends number,
> = GenericNumber extends DCommon.BaseConstraint
	? false
	: DCommon.IsEqual<GenericNumber, number> extends true
		? false
		: `${GenericNumber}` extends `${number}.${number}`
			? false
			: true;

type HasPositiveConstraint<
	GenericNumber extends number,
> = DCommon.Or<[
	DCommon.IsExtends<GenericNumber, Positive | StrictPositive>,
	ExtractGreaterThan<GenericNumber, unknown> extends GreaterThan<infer InferredMin>
		? IsPositiveLiteral<InferredMin>
		: false,
	ExtractGreaterThanOrEqual<GenericNumber, unknown> extends GreaterThanOrEqual<infer InferredMin>
		? IsPositiveLiteral<InferredMin>
		: false,
]>;

type HasIntegerConstraint<
	GenericNumber extends number,
> = DCommon.IsExtends<GenericNumber, Integer | Odd | Even>;

type ComputeIsPositiveInteger<
	GenericNumber extends number,
> = DCommon.And<[
	DCommon.Or<[
		HasPositiveConstraint<GenericNumber>,
		IsPositiveLiteral<GenericNumber>,
	]>,
	DCommon.Or<[
		HasIntegerConstraint<GenericNumber>,
		IsIntegerLiteral<GenericNumber>,
	]>,
]>;

export type IsPositiveInteger<
	GenericNumber extends number,
> = false extends (
	GenericNumber extends unknown
		? ComputeIsPositiveInteger<GenericNumber>
		: never
)
	? false
	: true;
