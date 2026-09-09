import type { At } from "./default";

export type First<
	GenericArray extends readonly unknown[],
> = At<GenericArray, 0>;

export function first<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): First<GenericArray>;

export function first(array: readonly unknown[]) {
	return array[0];
}
