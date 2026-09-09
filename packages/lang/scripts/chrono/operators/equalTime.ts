import type { TheTime } from "../theTime";
import { toTimeValue } from "../toTimeValue";
import type { SerializedTheTime } from "../types";

export function equalTime(
	second: TheTime | SerializedTheTime,
): (
	first: TheTime | SerializedTheTime,
) => boolean;

export function equalTime(
	first: TheTime | SerializedTheTime,
	second: TheTime | SerializedTheTime,
): boolean;

export function equalTime(
	...args:
		| [second: TheTime | SerializedTheTime]
		| [first: TheTime | SerializedTheTime, second: TheTime | SerializedTheTime]
) {
	if (args.length === 1) {
		const [second] = args;

		return (first: TheTime | SerializedTheTime) => equalTime(first, second);
	}

	const [first, second] = args;

	return toTimeValue(first) === toTimeValue(second);
}
