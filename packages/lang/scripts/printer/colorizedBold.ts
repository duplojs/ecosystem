import { bold } from "./bold";
import { colorized } from "./colorized";
import type { Colors } from "./types";

export function colorizedBold<
	GenericInput extends string,
>(
	color: Colors,
): (input: GenericInput) => string;

export function colorizedBold<
	GenericInput extends string,
>(
	input: GenericInput,
	color: Colors,
): string;

export function colorizedBold(
	...args:
		| [input: string, color: Colors]
		| [color: Colors]
): any {
	if (args.length === 1) {
		const [color] = args;

		return (input: string) => colorizedBold(input, color);
	}

	const [input, color] = args;

	return bold(colorized(input, color));
}
