import { type ComputedTypeError } from "./computedTypeError";
import { type IsUnion } from "./isUnion";

export type ForbiddenUnion<
	GenericValue extends unknown,
> = IsUnion<GenericValue> extends true
	? ComputedTypeError<"Union value is forbidden.">
	: unknown;
