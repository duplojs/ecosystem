export type PrintParams = (
	| "info"
	| "warn"
	| "error"
	| {
		columns: string[];
		depth?: never;
	}
	| {
		depth: number | null;
		columns?: never;
	}
);

export function print<const GenericInput>(
	input: GenericInput,
	params: PrintParams = "info",
): GenericInput {
	if (typeof params === "string") {
		console[params](input);
	} else if ("columns" in params) {
		console.table(input, params.columns);
	} else {
		console.dir(input, { depth: params.depth });
	}

	return input;
}
