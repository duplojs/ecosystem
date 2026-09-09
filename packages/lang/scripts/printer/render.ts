import type { RenderInput } from "./types";

export function render<
	GenericValues extends readonly RenderInput[],
>(
	joinCharacter: string,
): (values: GenericValues) => string;

export function render<
	GenericValues extends readonly RenderInput[],
>(
	values: GenericValues,
	joinCharacter: string,
): string;

export function render(
	...args:
		| [values: readonly RenderInput[], joinCharacter: string]
		| [joinCharacter: string]
): any {
	if (args.length === 1) {
		const [joinCharacter] = args;

		return (values: readonly RenderInput[]) => render(values, joinCharacter);
	}

	const [values, joinCharacter] = args;
	const printableValues: (string | true)[] = [];

	const collectPrintableValues = (value: RenderInput) => {
		if (value instanceof Array) {
			for (const childValue of value) {
				collectPrintableValues(childValue);
			}

			return;
		}

		if (typeof value === "string" || value === true) {
			printableValues.push(value);
		}
	};

	for (const value of values) {
		collectPrintableValues(value);
	}

	return printableValues.join(joinCharacter);
}
