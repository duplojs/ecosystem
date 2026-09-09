import type { StrictPositive } from "./constraints";

export function isStrictPositive<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & StrictPositive;

export function isStrictPositive(
	number: number,
): any {
	return number > 0;
}
