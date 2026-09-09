export function flat<
	const GenericArray extends readonly unknown[],
	const Depth extends number = 1,
>(
	array: GenericArray,
	depth?: Depth,
): FlatArray<GenericArray, Depth>[];

export function flat(array: readonly unknown[], depth?: number): any {
	return array.flat(depth);
}
