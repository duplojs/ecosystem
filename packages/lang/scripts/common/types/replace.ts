import type * as DKind from "@scripts/kind";
import { type BaseConstraint, type RemoveConstraint } from "../constraint";
import { type IsEqual } from "./isEqual";
import { type ContainExtends } from "./IsExtends";
import { type NeverCoalescing } from "./neverCoalescing";
import { type UnionContain } from "./unionContain";
import type * as DChrono from "@scripts/chrono";
import type * as DObject from "@scripts/object";
import type * as DModeling from "@scripts/modeling";
import { type DuploJSError } from "../error";

type ReplaceValue<
	GenericValue extends unknown,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
> = GenericReplaceType extends unknown
	? NeverCoalescing<
		GenericReplacer extends [unknown, unknown]
			? (
				GenericReplaceType extends "extends"
					? ContainExtends<GenericValue, GenericReplacer[0]>
					: IsEqual<GenericValue, GenericReplacer[0]>
			) extends true
				? [GenericReplacer[1], true]
				: never
			: never,
		[GenericValue, false]
	>
	: never;

// The conditional result expands the replaced shape in tooltips while preserving constraint aliases.
type ReplaceObject<
	GenericObject extends object,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
	GenericUnconstrainedValue = RemoveConstraint<GenericObject>,
	GenericClearValue = DKind.Remove<Extract<GenericUnconstrainedValue, object>>,
	GenericConstraint = (
		GenericObject extends (
			& GenericUnconstrainedValue
			& (infer InferredConstraint extends BaseConstraint)
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
> = GenericClearValue extends unknown
	? {
		readonly [Prop in keyof GenericClearValue]: ComputeReplace<
			GenericClearValue[Prop],
			GenericReplacer,
			GenericReplaceType
		>
	} & GenericConstraint & GenericEntity & GenericObjectTag
	: never;

// These types can be replaced directly, but their properties are not traversed.
export interface ReplaceTraversalExclusions {
	theDate: DChrono.TheDate;
	theTime: DChrono.TheTime;
	error: DuploJSError;
}

type ComputeReplace<
	GenericValue extends unknown,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
> = GenericValue extends unknown
	? ReplaceValue<
		GenericValue,
		GenericReplacer,
		GenericReplaceType
	> extends infer InferredResult extends [unknown, boolean]
		? InferredResult extends [infer InferredValue, false]
			? InferredValue extends DObject.Values<ReplaceTraversalExclusions>
				? InferredValue
				: InferredValue extends object
					? HasObjectReplacement<InferredValue, GenericReplacer, GenericReplaceType> extends true
						? ReplaceObject<InferredValue, GenericReplacer, GenericReplaceType>
						: InferredValue
					: InferredValue
			: InferredResult[0]
		: never
	: never;

type HasObjectReplacement<
	GenericObject extends object,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
	GenericVisited extends readonly unknown[] = readonly [],
	GenericClearValue = DKind.Remove<Extract<RemoveConstraint<GenericObject>, object>>,
> = UnionContain<GenericVisited[number], GenericObject> extends true
	? false
	: GenericClearValue extends object
		? HasReplacement<
			GenericClearValue extends readonly unknown[]
				? GenericClearValue[number]
				: DObject.Values<GenericClearValue>,
			GenericReplacer,
			GenericReplaceType,
			readonly [...GenericVisited, GenericObject]
		>
		: false;

type HasReplacement<
	GenericValue extends unknown,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
	GenericVisited extends readonly unknown[] = readonly [],
> = ContainExtends<
	GenericValue extends unknown
		? ReplaceValue<
			GenericValue,
			GenericReplacer,
			GenericReplaceType
		> extends infer InferredResult extends [unknown, boolean]
			? InferredResult extends [infer InferredValue, false]
				? InferredValue extends DObject.Values<ReplaceTraversalExclusions>
					? false
					: InferredValue extends object
						? HasObjectReplacement<
							InferredValue,
							GenericReplacer,
							GenericReplaceType,
							GenericVisited
						>
						: false
				: true
			: never
		: never,
	true
>;

export type Replace<
	GenericValue extends unknown,
	GenericReplacer extends [unknown, unknown],
	GenericReplaceType extends ("extends" | "equal"),
> = HasReplacement<
	GenericValue,
	GenericReplacer,
	GenericReplaceType
> extends true
	? ComputeReplace<
		GenericValue,
		GenericReplacer,
		GenericReplaceType
	>
	: GenericValue;
