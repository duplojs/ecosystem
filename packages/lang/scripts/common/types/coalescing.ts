import { type IsEqual } from "./isEqual";

export type Coalescing<
	GenericValue extends unknown,
	GenericReference extends unknown,
	GenericCoalescing extends unknown,
> = IsEqual<GenericValue, GenericReference> extends true
	? GenericCoalescing
	: GenericValue;
