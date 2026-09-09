import * as DArray from "@scripts/array";
import type { AnyConstructor } from "./types";

export function instanceOf<
	GenericInput extends unknown,
	GenericConstructor extends AnyConstructor,
>(
	valueConstructor: GenericConstructor | GenericConstructor[],
): (input: GenericInput) => input is Extract<
	GenericInput,
	InstanceType<GenericConstructor>
>;

export function instanceOf<
	GenericInput extends unknown,
	GenericConstructor extends AnyConstructor,
>(
	input: GenericInput,
	valueConstructor: GenericConstructor | GenericConstructor[],
): input is Extract<
	GenericInput,
	InstanceType<GenericConstructor>
>;

export function instanceOf(
	...args:
		| [input: unknown, valueConstructor: AnyConstructor | AnyConstructor[]]
		| [valueConstructor: AnyConstructor | AnyConstructor[]]
) {
	if (args.length === 1) {
		const [valueConstructor] = args;

		return (input: unknown) => instanceOf(input, valueConstructor);
	}

	const [input, valueConstructor] = args;

	const valueConstructors = DArray.coalescing(valueConstructor);

	for (const currentConstructor of valueConstructors) {
		if (input instanceof currentConstructor) {
			return true;
		}
	}

	return false;
}
