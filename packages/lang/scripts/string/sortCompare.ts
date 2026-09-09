const collator = new Intl.Collator(
	"en-US-u-kn-true",
	{
		usage: "sort",
		sensitivity: "variant",
		numeric: true,
		ignorePunctuation: false,
	},
);

export function sortCompare(
	valueB: string,
): (
	valueA: string,
) => number;

export function sortCompare(
	valueA: string,
	valueB: string,
): number;

export function sortCompare(
	...args:
		| [valueB: string]
		| [valueA: string, valueB: string]
) {
	if (args.length === 1) {
		const [valueB] = args;

		return (valueA: string) => sortCompare(valueA, valueB);
	}

	const [valueA, valueB] = args;

	return collator.compare(valueA, valueB);
}
