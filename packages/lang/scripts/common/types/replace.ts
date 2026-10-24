import type * as DKind from "@scripts/kind";
import { type RemoveConstraint } from "../constraint";
import { type IsEqual } from "./isEqual";
import { type ContainExtends } from "./IsExtends";
import { type NeverCoalescing } from "./neverCoalescing";
import type * as DModeling from "@scripts/modeling";

type ReplaceValue<
	GenericValue extends unknown,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
> = GenericReplaceType extends "extends"
	? NeverCoalescing<
		GenericReplacer extends [unknown, unknown]
			? GenericValue extends GenericReplacer[0]
				? [GenericReplacer[1], true]
				: never
			: never,
		[GenericValue, false]
	>
	: GenericReplaceType extends "equal"
		? NeverCoalescing<
			GenericReplacer extends [unknown, unknown]
				? IsEqual<GenericValue, GenericReplacer[0]> extends true
					? [GenericReplacer[1], true]
					: never
				: never,
			[GenericValue, false]
		>
		: [GenericValue, false];

type ReplaceArray<
	GenericArray extends readonly unknown[],
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
	GenericClearArray = RemoveConstraint<DKind.Remove<GenericArray>>,
	GenericConstraint = (
		GenericArray extends (
				& GenericClearArray
				& infer InferredConstraint
		)
			? InferredConstraint
			: unknown
	),
> = GenericClearArray extends readonly [infer InferredFirst, ...infer InferredRest]
	? [
		ComputeReplace<
			InferredFirst,
			GenericReplacer,
			GenericReplaceType
		>,
		ReplaceArray<
			InferredRest,
			GenericReplacer,
			GenericReplaceType
		>,
	] extends [
		infer InferredFirstResult extends [unknown, boolean],
		infer InferredRestResult extends [readonly unknown[], boolean],
	]
		? [
			& readonly [
				InferredFirstResult[0],
				...InferredRestResult[0],
			]
			& GenericConstraint,
			ContainExtends<
				| InferredFirstResult
				| InferredRestResult,
				[unknown, true]
			>,
		]
		: never
	: GenericClearArray extends readonly []
		? [
			& GenericClearArray
			& GenericConstraint,
			false,
		]
		: GenericClearArray extends readonly (infer InferredElement)[]
			? ComputeReplace<
				InferredElement,
				GenericReplacer,
				GenericReplaceType
			> extends infer InferredResult extends [unknown, boolean]
				? [
					& readonly InferredResult[0][]
					& GenericConstraint,
					InferredResult[1],
				]
				: never
			: [
				& GenericClearArray
				& GenericConstraint,
				false,
			];

type ReplaceObject<
	GenericObject extends object,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
	GenericClearValue = RemoveConstraint<DKind.Remove<GenericObject>>,
	GenericConstraint = (
		GenericObject extends (
				& GenericClearValue
				& infer InferredConstraint
		)
			? InferredConstraint
			: unknown
	),
	GenericEntity = (
		GenericObject extends DModeling.Entity<infer InferredName>
			? DModeling.Entity<InferredName>
			: unknown
	),
	GenericObjectTag = (
		GenericObject extends DModeling.ObjectTag<infer InferredName>
			? DModeling.ObjectTag<InferredName>
			: unknown
	),
> = {
	[Prop in keyof GenericClearValue]: ComputeReplace<
		GenericClearValue[Prop],
		GenericReplacer,
		GenericReplaceType
	>
} extends infer InferredResult extends Record<string, [unknown, boolean]>
	? [
		& {
			readonly [Prop in keyof InferredResult]: InferredResult[Prop][0]
		}
		& GenericConstraint
		& GenericEntity
		& GenericObjectTag,
		ContainExtends<
			InferredResult[keyof InferredResult],
			[unknown, true]
		>,
	]
	: never;

type ComputeReplace<
	GenericValue extends unknown,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
> = (
	GenericValue extends unknown
		? ReplaceValue<
			GenericValue,
			GenericReplacer,
			GenericReplaceType
		> extends infer InferredResult extends [unknown, boolean]
			? InferredResult extends [infer InferredValue, false]
				? InferredValue extends readonly unknown[]
					? ReplaceArray<
						InferredValue,
						GenericReplacer,
						GenericReplaceType
					>
					: InferredValue extends object
						? ReplaceObject<
							InferredValue,
							GenericReplacer,
							GenericReplaceType
						>
						: [InferredValue, false]
				: InferredResult
			: never
		: never
) extends infer InferredResult extends [unknown, boolean]
	? [
		InferredResult[0],
		ContainExtends<
			InferredResult,
			[unknown, true]
		>,
	]
	: never;

export type Replace<
	GenericValue extends unknown,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
> = ComputeReplace<
	GenericValue,
	GenericReplacer,
	GenericReplaceType
> extends [infer InferredResult, true]
	? InferredResult
	: GenericValue;
