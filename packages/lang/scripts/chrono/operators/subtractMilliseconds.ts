import { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function subtractMilliseconds<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMillisecond extends number,
>(
	millisecond: GenericMillisecond,
): (
	date: GenericDate,
) => TheDate;

export function subtractMilliseconds<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMillisecond extends number,
>(
	date: GenericDate,
	millisecond: GenericMillisecond,
): TheDate;

export function subtractMilliseconds(
	...args:
		| [millisecond: number]
		| [date: TheDate | SerializedTheDate, millisecond: number]
) {
	if (args.length === 1) {
		const [millisecond] = args;

		return (date: TheDate | SerializedTheDate) => subtractMilliseconds(date, millisecond);
	}

	const [date, millisecond] = args;

	return TheDate.new(toTimestamp(date) - millisecond);
}
