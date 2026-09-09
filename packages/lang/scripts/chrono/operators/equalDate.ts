import type { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function equalDate(
	second: TheDate | SerializedTheDate,
): (
	first: TheDate | SerializedTheDate,
) => boolean;

export function equalDate(
	first: TheDate | SerializedTheDate,
	second: TheDate | SerializedTheDate,
): boolean;

export function equalDate(
	...args:
		| [second: TheDate | SerializedTheDate]
		| [first: TheDate | SerializedTheDate, second: TheDate | SerializedTheDate]
) {
	if (args.length === 1) {
		const [second] = args;

		return (first: TheDate | SerializedTheDate) => equalDate(first, second);
	}

	const [first, second] = args;

	return toTimestamp(first) === toTimestamp(second);
}
