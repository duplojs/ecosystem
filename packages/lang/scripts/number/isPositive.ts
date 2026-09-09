import type { Positive } from "./constraints";

export function isPositive<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Positive;

export function isPositive(
	number: number,
): any {
	return number >= 0;
}
