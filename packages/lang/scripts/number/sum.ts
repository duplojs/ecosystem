export function sum<
	GenericValues extends readonly number[],
>(
	values: GenericValues,
): number {
	let result = 0;

	for (const value of values) {
		result += value;
	}

	return result;
}
