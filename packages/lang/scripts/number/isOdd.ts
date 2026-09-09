import type { Odd } from "./constraints";

export function isOdd<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Odd;

export function isOdd(
	number: number,
) {
	return number % 2 !== 0;
}
