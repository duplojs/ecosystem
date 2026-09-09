import type * as DObject from "@scripts/object";
import type * as DCommon from "@scripts/common";
import type { BaseConstraint } from "./base";

type Remove<
	GenericValue extends unknown,
	GenericShape extends object,
	GenericLast extends object,
> = GenericValue extends (
	& infer InferredValue
	& GenericShape
)
	? RemoveConstraintByShape<
		InferredValue,
		DCommon.ExcludeEqual<GenericShape, GenericLast>
	>
	: GenericValue;

type RemoveConstraintByShape<
	GenericValue extends unknown,
	GenericShape extends object,
> = DCommon.IsNever<GenericShape> extends true
	? GenericValue
	: Remove<
		GenericValue,
		GenericShape,
		DCommon.LastUnionElement<GenericShape>
	>;

export type RemoveConstraint<
	GenericValue extends unknown,
> = (
	GenericValue extends BaseConstraint
		? RemoveConstraintByShape<
			GenericValue,
			DObject.Split<
				Pick<GenericValue, DCommon.ConstraintSymbol>
			>
		>
		: GenericValue
) extends infer InferredResult
	? (
		InferredResult extends BaseConstraint
			? RemoveConstraintByShape<
				InferredResult,
				Pick<InferredResult, DCommon.ConstraintSymbol>
			>
			: InferredResult
	) extends infer InferredResult
		? (
			InferredResult extends BaseConstraint
				? RemoveConstraintByShape<
					InferredResult,
					DObject.Split<
						Pick<InferredResult, DCommon.ConstraintSymbol>,
						2
					>
				>
				: InferredResult
		) extends infer InferredResult
			? (
				InferredResult extends BaseConstraint
					? RemoveConstraintByShape<
						InferredResult,
						DObject.EveryCombination<
							Pick<InferredResult, DCommon.ConstraintSymbol>
						>
					>
					: InferredResult
			)
			: never
		: never
	: never;
