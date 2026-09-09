import { type RemoveConstraint } from "./types";

export function removeConstraint<
	GenericValue extends unknown,
>(
	value: GenericValue,
): GenericValue extends unknown
	? RemoveConstraint<GenericValue>
	: never {
	return value as never;
}
