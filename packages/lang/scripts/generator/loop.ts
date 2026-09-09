import type * as DCommon from "@scripts/common";

export interface LoopOutputExistResult<
	GenericOutput extends unknown = unknown,
> {
	"-exitData": GenericOutput;
}

export interface LoopOutputNextResult<
	GenericOutput extends unknown = unknown,
> {
	"-nextData": GenericOutput;
}

export interface LoopParams<
	GenericRawNextOutput extends any,
> {
	count: number;
	previousOutput: GenericRawNextOutput | undefined;
	next<
		GenericValue extends GenericRawNextOutput | undefined = undefined,
	>(
		output?: GenericValue
	): LoopOutputNextResult<GenericValue>;
	exit<
		GenericOutput extends DCommon.AnyValue = undefined,
	>(
		output?: GenericOutput
	): LoopOutputExistResult<GenericOutput>;
}

export function *loop<
	GenericRawExitOutput extends DCommon.AnyValue = undefined,
	GenericRawNextOutput extends DCommon.AnyValue = undefined,
>(
	loop: (
		params: LoopParams<GenericRawNextOutput>,
	) => (
		| LoopOutputNextResult<GenericRawNextOutput>
		| LoopOutputNextResult<undefined>
		| LoopOutputExistResult<GenericRawExitOutput>
		| LoopOutputExistResult<undefined>
	),
): Generator<
	Exclude<
		GenericRawExitOutput | GenericRawNextOutput,
		undefined
	>,
	unknown,
	unknown
> {
	let previousOutput: any = undefined;

	for (let count = 0; true; count++) {
		const result = loop({
			previousOutput,
			count,
			next: (data) => ({ "-nextData": data as any }),
			exit: (data) => ({ "-exitData": data as any }),
		});

		if ("-exitData" in result) {
			if (result["-exitData"] !== undefined) {
				yield result["-exitData"] as never;
			}
			break;
		}

		previousOutput = result["-nextData"];

		if (previousOutput !== undefined) {
			yield previousOutput;
		}
	}

	return;
}
