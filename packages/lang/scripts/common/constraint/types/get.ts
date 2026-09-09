import { type BaseConstraint } from "./base";
import type { RemoveConstraint } from "./remove";

export type GetConstraint<
	GenericValue extends unknown,
> = GenericValue extends (
		& (infer InferredValue extends BaseConstraint)
		& RemoveConstraint<GenericValue>
)
	? InferredValue
	: never;
