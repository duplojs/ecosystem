import type { Safe } from "./constraints";

export function isSafe<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Safe;

export function isSafe(
	number: number,
) {
	return (
		number > Number.MIN_SAFE_INTEGER
		&& number < Number.MAX_SAFE_INTEGER
		&& Number.isFinite(number)
		&& !Number.isNaN(number)
	);
}
