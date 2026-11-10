
export interface LoopOutputExistResult<
	GenericOutput extends unknown = unknown,
> {
	"-exitData": readonly GenericOutput[];
}

export interface LoopOutputNextResult<
	GenericOutput extends unknown = unknown,
> {
	"-nextData": readonly GenericOutput[];
}

export interface LoopParams<
	GenericRawNextOutput extends unknown,
> {
	count: number;
	next<const GenericOutputs extends readonly (GenericRawNextOutput | undefined)[]>(
		...outputs: GenericOutputs
	): LoopOutputNextResult<GenericOutputs[number]>;
	exit<const GenericOutputs extends readonly (GenericRawNextOutput | undefined)[]>(
		...outputs: GenericOutputs
	): LoopOutputExistResult<GenericOutputs[number]>;
}

export type LoopResult<
	GenericOutput extends unknown = unknown,
> = LoopOutputNextResult<GenericOutput> | LoopOutputExistResult<GenericOutput>;

export type LoopOutputValue<
	GenericResult extends unknown,
> = GenericResult extends (
	| LoopOutputNextResult<infer InferredOutput>
	| LoopOutputExistResult<infer InferredOutput>
)
	? InferredOutput
	: never;

export function loop<
	GenericRawNextOutput extends unknown,
	GenericResult extends LoopResult<GenericRawNextOutput | undefined>,
>(
	loop: (params: LoopParams<GenericRawNextOutput>) => GenericResult,
): Generator<Exclude<LoopOutputValue<GenericResult>, undefined>, unknown, unknown>;

export function *loop(
	loop: (params: LoopParams<unknown>) => LoopResult,
): Generator<unknown, unknown, unknown> {
	for (let count = 0; true; count++) {
		const result = loop({
			count,
			next: (...outputs) => ({ "-nextData": outputs }),
			exit: (...outputs) => ({ "-exitData": outputs }),
		});

		if ("-exitData" in result) {
			for (const output of result["-exitData"]) {
				if (output !== undefined) {
					yield output;
				}
			}
			break;
		}

		for (const output of result["-nextData"]) {
			if (output !== undefined) {
				yield output;
			}
		}
	}

	return;
}
