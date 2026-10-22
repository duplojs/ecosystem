export function simpleClone<
	GenericInput extends unknown = unknown,
>(
	input: GenericInput,
): GenericInput;

export function simpleClone(
	input: unknown,
): unknown {
	if (!input) {
		return input;
	} else if (typeof input !== "object") {
		return input;
	} else if (
		input.constructor === undefined
		|| input.constructor.name === "Object"
	) {
		const output: Record<PropertyKey, unknown> = {};
		const stringKeys: string[] = [];

		for (const key in input) {
			stringKeys.push(key);
		}

		const keys = [
			...stringKeys,
			...Object.getOwnPropertySymbols(input),
		];

		for (const key of keys) {
			const descriptor = Object.getOwnPropertyDescriptor(input, key);

			if (descriptor?.enumerable === false) {
				continue;
			}

			if (descriptor?.set || descriptor?.get) {
				Object.defineProperty(
					output,
					key,
					descriptor,
				);
			} else {
				output[key] = simpleClone(input[key as never]);
			}
		}

		return output;
	} else if (input instanceof Array && input.constructor.name === "Array") {
		return input.map(simpleClone);
	} else {
		return input;
	}
}
