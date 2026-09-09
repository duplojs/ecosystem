import type { Negative } from "./constraints";

export function isStrictNegative<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Negative;

export function isStrictNegative(
	number: number,
): any {
	return number < 0;
}
