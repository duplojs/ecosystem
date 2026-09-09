
type Enumerable = | ArrayLike<unknown> | Iterable<unknown> | AsyncIterable<unknown>;

type FromOutput<
	GenericEnumerable extends Enumerable,
> = GenericEnumerable extends AsyncIterable<infer InferredValue>
	? Promise<InferredValue[]>
	: GenericEnumerable extends Iterable<infer InferredValue>
		? InferredValue[]
		: GenericEnumerable extends ArrayLike<infer InferredValue>
			? InferredValue[]
			: never;

export function from<
	const GenericEnumerable extends Enumerable,
>(
	input: GenericEnumerable,
): FromOutput<GenericEnumerable>;

export function from(
	input: Enumerable,
) {
	if (typeof input === "object" && Symbol.asyncIterator in input) {
		return (async() => {
			const array: unknown[] = [];

			for await (const element of input as AsyncGenerator) {
				array.push(element);
			}

			return array;
		})();
	}

	return Array.from(input);
}
