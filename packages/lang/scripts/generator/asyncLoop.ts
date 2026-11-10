import type * as DCommon from "@scripts/common";
import type { LoopResult, LoopOutputValue, LoopParams } from "./loop";

export interface AsyncLoopParams<
	GenericOutput extends unknown,
> extends LoopParams<DCommon.MaybePromise<GenericOutput | undefined>> {}

export function asyncLoop<
	GenericRawNextOutput extends unknown,
	GenericResult extends DCommon.MaybePromise<LoopResult<DCommon.MaybePromise<GenericRawNextOutput | undefined>>>,
>(
	loop: (params: AsyncLoopParams<GenericRawNextOutput>) => GenericResult,
): AsyncGenerator<Exclude<Awaited<LoopOutputValue<Awaited<GenericResult>>>, undefined>, unknown, unknown>;

export async function *asyncLoop(
	loop: (params: AsyncLoopParams<unknown>) => DCommon.MaybePromise<LoopResult>,
): AsyncGenerator<unknown, unknown, unknown> {
	for (let count = 0; true; count++) {
		const result = await loop({
			count,
			next: (...outputs) => ({ "-nextData": outputs }),
			exit: (...outputs) => ({ "-exitData": outputs }),
		});

		if ("-exitData" in result) {
			for (const output of result["-exitData"]) {
				const resolvedOutput = await output;
				if (resolvedOutput !== undefined) {
					yield resolvedOutput;
				}
			}
			break;
		}

		for (const output of result["-nextData"]) {
			const resolvedOutput = await output;
			if (resolvedOutput !== undefined) {
				yield resolvedOutput;
			}
		}
	}

	return;
}
