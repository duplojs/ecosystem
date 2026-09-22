import type * as DModeling from "@scripts/modeling";
import { type RemoveConstraint } from "../constraint";
import type { MaybeArray } from "./maybeArray";
import type * as DKind from "@scripts/kind";

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

type ObjectToJson<
	GenericValue extends object,
	GenericIgnore extends unknown,
	GenericClearValue = RemoveConstraint<DKind.Remove<GenericValue>>,
	GenericConstraint = (
		GenericValue extends (
			& GenericClearValue
			& infer InferredConstraint
		)
			? InferredConstraint
			: unknown
	),
	GenericEntity = (
		GenericValue extends DModeling.Entity<infer InferredName>
			? DModeling.Entity<InferredName>
			: unknown
	),
	GenericObjectTag = (
		GenericValue extends DModeling.ObjectTag<infer InferredName>
			? DModeling.ObjectTag<InferredName>
			: unknown
	),
> = GenericClearValue extends [infer InferredFirst, ...infer InferredRest]
	? [ToJson<InferredFirst, GenericIgnore>, ...ToJson<InferredRest, GenericIgnore>] & GenericConstraint
	: GenericClearValue extends []
		? [] & GenericConstraint
		: GenericClearValue extends (infer InferredElement)[]
			? ToJson<InferredElement, GenericIgnore>[] & GenericConstraint
			: GenericClearValue extends readonly [infer InferredFirst, ...infer InferredRest]
				? readonly [ToJson<InferredFirst, GenericIgnore>, ...ToJson<InferredRest, GenericIgnore>]
				: GenericClearValue extends readonly [] & GenericConstraint
					? readonly [] & GenericConstraint
					: GenericClearValue extends readonly (infer InferredElement)[]
						? readonly ToJson<InferredElement, GenericIgnore>[] & GenericConstraint
						: GenericClearValue extends object
							? (
								& {
									[Prop in keyof GenericClearValue]: ToJson<GenericClearValue[Prop], GenericIgnore>
								}
								& GenericConstraint
								& GenericEntity
								& GenericObjectTag
							)
							: never;

export type ToJson<
	GenericValue extends unknown,
	GenericIgnore extends unknown = never,
> = GenericValue extends (
	| JsonPrimitive
	| GenericIgnore
)
	? GenericValue
	: GenericValue extends { toJSON(): unknown }
		? ToJson<ReturnType<GenericValue["toJSON"]>, GenericIgnore>
		: GenericValue extends object
			? ObjectToJson<GenericValue, GenericIgnore>
			: GenericValue;
