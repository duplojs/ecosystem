import type { LoopParams } from "./loop";
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

export function asyncLoop<
	GenericExitOutput extends AnyValue = undefined,
	GenericNextOutput extends AnyValue = undefined,
>(
	callback: (params: LoopParams<GenericNextOutput>) => Promise<
		| LoopOutputNextResult<GenericNextOutput | undefined>
		| LoopOutputExitResult<GenericExitOutput>
	>,
): Promise<GenericExitOutput>;

export async function asyncLoop(
	callback: (params: LoopParams<AnyValue>) => Promise<
		| LoopOutputNextResult<AnyValue>
		| LoopOutputExitResult<AnyValue>
	>,
): Promise<AnyValue> {
	let previousOutput: AnyValue = undefined;

	for (let count = 0; true; count++) {
		const result = await callback({
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
