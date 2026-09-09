import type * as DObject from "@scripts/object";
import type * as DArray from "@scripts/array";
import type * as DNumber from "@scripts/number";
import type * as DString from "@scripts/string";
import type * as DCommon from "@scripts/common";
import { type BaseConstraint } from "./base";

declare const RestSymbol: unique symbol;
type RestSymbol = typeof RestSymbol;
type Rest<
	GenericConstraint extends BaseConstraint = BaseConstraint,
> = [
	GenericConstraint,
	RestSymbol,
];

type UnwrapRest<
	GenericValue extends unknown,
> = GenericValue extends Rest
	? GenericValue[0]
	: GenericValue;

type Separate<
	GenericValue extends unknown,
	GenericShape extends object,
	GenericLast extends object,
> = GenericValue extends (
	& infer InferredRest
	& GenericLast
)
	? GenericValue extends (
		& infer InferredConstraint
		& InferredRest
	)
		? (
			| Extract<InferredConstraint, BaseConstraint>
			| SeparateByShape<
				InferredRest,
				DCommon.ExcludeEqual<GenericShape, GenericLast>
			>
		)
		: never
	: never;

type SeparateByShape<
	GenericValue extends unknown,
	GenericShape extends object,
> = DCommon.IsNever<GenericShape> extends true
	? GenericValue extends BaseConstraint
		? Rest<GenericValue>
		: never
	: Separate<
		GenericValue,
		GenericShape,
		DCommon.LastUnionElement<GenericShape>
	>;

export type UnbundlesConstraint<
	GenericValue extends unknown,
> = (
	| (
		GenericValue extends BaseConstraint
			? SeparateByShape<
				GenericValue,
				DObject.Split<
					Pick<GenericValue, DCommon.ConstraintSymbol>
				>
			>
			: never
	)
	| (
		GenericValue extends DCommon.AnyTuple
			? (
				| DArray.ExtractMinElements<GenericValue>
				| DArray.ExtractMaxElements<GenericValue>
				| DArray.ExtractLengthEqual<GenericValue>
			)
			: GenericValue extends number
				? (
					| DNumber.ExtractGreaterThanOrEqual<GenericValue>
					| DNumber.ExtractLessThanOrEqual<GenericValue>
				)
				: GenericValue extends string
					? (
						| DString.ExtractLengthEqual<GenericValue>
						| DString.ExtractMinCharacters<GenericValue>
						| DString.ExtractMaxCharacters<GenericValue>
					)
					: never
	)
) extends infer InferredResult
	? (
		InferredResult extends Rest
			? UnwrapRest<
				SeparateByShape<
					InferredResult[0],
					Pick<InferredResult[0], DCommon.ConstraintSymbol>
				>
			>
			: InferredResult
	) extends infer InferredResult
		? (
			InferredResult extends Rest
				? UnwrapRest<
					SeparateByShape<
						InferredResult[0],
						DObject.Split<
							Pick<InferredResult[0], DCommon.ConstraintSymbol>,
							2
						>
					>
				>
				: InferredResult
		) extends infer InferredResult
			? (
				InferredResult extends Rest
					? UnwrapRest<
						SeparateByShape<
							InferredResult[0],
							DObject.EveryCombination<
								Pick<InferredResult[0], DCommon.ConstraintSymbol>,
								2
							>
						>
					>
					: InferredResult
			)
			: never
		: never
	: never;

