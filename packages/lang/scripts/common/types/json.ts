import type * as DModeling from "@scripts/modeling";
import type * as DKind from "@scripts/kind";
import { type BaseConstraint, type ConstraintSymbol, type RemoveConstraint } from "../constraint";
import type { MaybeArray } from "./maybeArray";
import type { IsEqual } from "./isEqual";
import type { UnionToIntersection } from "./unionToIntersection";

export type JsonPrimitive = (
	| string
	| undefined
	| boolean
	| number
	| null
);

export type Json = MaybeArray<
	| JsonPrimitive
	| { readonly [key: string]: Json }
>;

type FlagMetadata<
	GenericFlags extends Record<Capitalize<string>, unknown>,
> = UnionToIntersection<{
	[Prop in keyof GenericFlags]: Prop extends Capitalize<string>
		? DModeling.Flag<Prop, GenericFlags[Prop]>
		: never
}[keyof GenericFlags]>;

type PropertiesToJson<
	GenericValue,
	GenericIgnore,
> = {
	[Prop in keyof GenericValue]: ToJson<GenericValue[Prop], GenericIgnore>
};

type ObjectToJson<
	GenericValue extends object,
	GenericIgnore extends unknown,
	GenericUnconstrainedValue = (
		GenericValue extends BaseConstraint
			? GenericValue extends infer InferredValue & Pick<GenericValue, ConstraintSymbol>
				? RemoveConstraint<InferredValue>
				: never
			: GenericValue
	),
	GenericConstraint = (
		GenericValue extends (
			& GenericUnconstrainedValue
			& (infer InferredConstraint extends BaseConstraint)
		)
			? InferredConstraint
			: unknown
	),
	GenericMetadata = (
		& (
			GenericValue extends DModeling.Entity<infer InferredName>
				? DModeling.Entity<InferredName>
				: unknown
		)
		& (
			GenericValue extends DModeling.ObjectTag<infer InferredName>
				? DModeling.ObjectTag<InferredName>
				: unknown
		)
		& (
			GenericValue extends DModeling.Flag
				? FlagMetadata<DKind.GetValue<typeof DModeling.flagKind, GenericValue>>
				: unknown
		)
		& (
			GenericValue extends DModeling.Fact<infer InferredName, infer InferredPayload>
				? DModeling.Fact<InferredName, InferredPayload>
				: unknown
		)
	),
	GenericClearValue = (
		GenericUnconstrainedValue extends GenericMetadata & infer InferredValue
			? InferredValue
			: never
	),
> = GenericClearValue extends unknown
	? (
		GenericClearValue extends readonly unknown[]
			? number extends GenericClearValue["length"]
				? Exclude<keyof GenericClearValue, keyof unknown[]> extends never
					? GenericClearValue extends readonly [...unknown[], unknown]
						? PropertiesToJson<GenericClearValue, GenericIgnore>
						// Expand plain arrays directly to avoid recursive mapped type checks.
						: GenericClearValue extends unknown[]
							? ToJson<GenericClearValue[number], GenericIgnore>[]
							: readonly ToJson<GenericClearValue[number], GenericIgnore>[]
					: PropertiesToJson<GenericClearValue, GenericIgnore>
				: PropertiesToJson<GenericClearValue, GenericIgnore>
			: PropertiesToJson<GenericClearValue, GenericIgnore>
	) & GenericConstraint & GenericMetadata
	: never;

export type ToJson<
	GenericValue extends unknown,
	GenericIgnore extends unknown = never,
> = IsEqual<GenericValue, any> extends true
	? GenericValue
	: GenericValue extends (
		| JsonPrimitive
		| GenericIgnore
	)
		? GenericValue
		: GenericValue extends { toJSON(): unknown }
			? ToJson<ReturnType<GenericValue["toJSON"]>, GenericIgnore>
			: GenericValue extends object
				? ObjectToJson<GenericValue, GenericIgnore>
				: GenericValue;
