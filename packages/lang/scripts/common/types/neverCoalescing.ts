import { type IsNever } from "./isNever";

export type NeverCoalescing<
	GenericValue extends unknown,
	GenericCoalescingValue extends unknown,
> = IsNever<GenericValue> extends true
	? GenericCoalescingValue
	: GenericValue;
