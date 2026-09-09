import type * as DCommon from "@scripts/common";

export type MultipleOfConstraintName = "number-multiple-of";

export interface MultipleOf<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<MultipleOfConstraintName, GenericNumber> {}

export type ExtractMultipleOf<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends MultipleOf<number>
	? (
		keyof GenericConstraint[DCommon.ConstraintSymbol][MultipleOfConstraintName]
	) extends infer InferredResult extends number
		? DCommon.UnionToIntersection<
			InferredResult extends any
				? MultipleOf<InferredResult>
				: never
		>
		: GenericDefault
	: GenericDefault;
