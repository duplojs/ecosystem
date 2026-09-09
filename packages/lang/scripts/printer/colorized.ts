import { codeColors, codeReset } from "./codes";
import type { Colors } from "./types";

export function colorized<
	GenericInput extends string,
>(
	color: Colors,
): (input: GenericInput) => string;

export function colorized<
	GenericInput extends string,
>(
	input: GenericInput,
	color: Colors,
): string;

export function colorized(
	...args:
		| [input: string, color: Colors]
		| [color: Colors]
): any {
	if (args.length === 1) {
		const [color] = args;

		return (input: string) => colorized(input, color);
	}

	const [input, color] = args;

	return `${codeColors[color]}${input}${codeReset}`;
}
