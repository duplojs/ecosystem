import type { Negative } from "./constraints";

export function isNegative<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Negative;

export function isNegative(
	number: number,
): any {
	return number <= 0;
}
