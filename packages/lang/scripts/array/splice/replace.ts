export function spliceReplace<
	GenericElements extends readonly unknown[],
>(
	indexFrom: number,
	elements: GenericElements,
): <GenericArray extends readonly unknown[]>(
	array: GenericArray,
) => (GenericArray[number] | GenericElements[number])[];

export function spliceReplace<
	GenericArray extends readonly unknown[],
	GenericElements extends readonly unknown[],
>(
	array: GenericArray,
	indexFrom: number,
	elements: GenericElements,
): (GenericArray[number] | GenericElements[number])[];

export function spliceReplace(
	...args:
		| [indexFrom: number, elements: readonly unknown[]]
		| [array: readonly unknown[], indexFrom: number, elements: readonly unknown[]]
) {
	if (args.length === 2) {
		const [indexFrom, elements] = args;

		return (array: readonly unknown[]) => spliceReplace(array, indexFrom, elements);
	}

	const [array, indexFrom, elements] = args;

	const result = array.slice();
	// Use a loop if spread inputs can become large.
	result.splice(indexFrom, elements.length, ...elements);

	return result;
}
