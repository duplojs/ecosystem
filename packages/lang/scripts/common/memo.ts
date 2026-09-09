export interface Memoized<
	GenericValue extends unknown,
> {
	readonly value: GenericValue;
}

export function memo<
	GenericOutput extends unknown,
>(
	theFunction: () => GenericOutput,
): Memoized<GenericOutput> {
	const payload = {
		get value() {
			const value = theFunction();

			Object.defineProperty(
				this,
				"value",
				{
					value,
				},
			);

			return value;
		},
	};

	return payload;
}
