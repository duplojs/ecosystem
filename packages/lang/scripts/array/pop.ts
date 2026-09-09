import type { ReapplyCompatiblesConstraints } from "./constraints";

type PopOutput<
	GenericArray extends readonly unknown[],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly GenericArray[number][],
		"maxElements"
	>
	: never;

export function pop<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): PopOutput<GenericArray>;

export function pop(array: readonly unknown[]): any {
	return array.slice(0, -1);
}
