import { millisecondsInOneSecond } from "../constants";
import { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function addSeconds<
	GenericDate extends TheDate | SerializedTheDate,
	GenericSecond extends number,
>(
	second: GenericSecond,
): (
	date: GenericDate,
) => TheDate;

export function addSeconds<
	GenericDate extends TheDate | SerializedTheDate,
	GenericSecond extends number,
>(
	date: GenericDate,
	second: GenericSecond,
): TheDate;

export function addSeconds(
	...args:
		| [second: number]
		| [date: TheDate | SerializedTheDate, second: number]
) {
	if (args.length === 1) {
		const [second] = args;

		return (date: TheDate | SerializedTheDate) => addSeconds(date, second);
	}

	const [date, second] = args;

	return TheDate.new(toTimestamp(date) + (second * millisecondsInOneSecond));
}
