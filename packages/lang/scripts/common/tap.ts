import { callThen } from "./callThen";
import type { AnyFunction } from "./types";

export function tap<
	GenericInput extends unknown,
	GenericTapOutput extends unknown,
>(
	theFunction: (input: GenericInput) => GenericTapOutput,
): (input: GenericInput) => (
	GenericTapOutput extends Promise<unknown>
		? Promise<GenericInput>
		: GenericInput
);

export function tap<
	GenericInput extends unknown,
	GenericTapOutput extends unknown,
>(
	input: GenericInput,
	theFunction: (input: GenericInput) => GenericTapOutput,
): (
	GenericTapOutput extends Promise<unknown>
		? Promise<GenericInput>
		: GenericInput
);

export function tap(
	...args:
		| [theFunction: AnyFunction]
		| [input: unknown, theFunction: AnyFunction]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (input: unknown) => tap(input, theFunction);
	}

	const [input, theFunction] = args;

	return callThen(theFunction(input), () => input);
}
