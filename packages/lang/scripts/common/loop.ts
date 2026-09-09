import type { AnyValue } from "./types";

interface LoopOutputExitResult<
	GenericOutput extends AnyValue,
> {
	"-exitData": GenericOutput;
}

interface LoopOutputNextResult<
	GenericOutput extends AnyValue,
> {
	"-nextData": GenericOutput;
}

export interface LoopParams<
	GenericNextOutput extends AnyValue,
> {
	count: number;
	previousOutput: GenericNextOutput | undefined;
	next<
		GenericValue extends GenericNextOutput | undefined = undefined,
	>(output?: GenericValue): LoopOutputNextResult<GenericValue>;
	exit<
		GenericOutput extends AnyValue = undefined,
	>(output?: GenericOutput): LoopOutputExitResult<GenericOutput>;
}

export function loop<
	GenericExitOutput extends AnyValue = undefined,
	GenericNextOutput extends AnyValue = undefined,
>(
	callback: (params: LoopParams<GenericNextOutput>) =>
		| LoopOutputNextResult<GenericNextOutput>
		| LoopOutputExitResult<GenericExitOutput>,
): GenericExitOutput;

export function loop(
	callback: (params: LoopParams<AnyValue>) =>
		| LoopOutputNextResult<AnyValue>
		| LoopOutputExitResult<AnyValue>,
): AnyValue {
	let previousOutput: AnyValue = undefined;

	for (let count = 0; true; count++) {
		const result = callback({
			previousOutput,
			count,
			next: (data) => ({ "-nextData": data as never }),
			exit: (data) => ({ "-exitData": data as never }),
		});

		if ("-exitData" in result) {
			return result["-exitData"];
		}

		previousOutput = result["-nextData"];
	}
}
