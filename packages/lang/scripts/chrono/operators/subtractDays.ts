import { millisecondsInOneDay } from "../constants";
import { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function subtractDays<
	GenericDate extends TheDate | SerializedTheDate,
	GenericDay extends number,
>(
	day: GenericDay,
): (
	date: GenericDate,
) => TheDate;

export function subtractDays<
	GenericDate extends TheDate | SerializedTheDate,
	GenericDay extends number,
>(
	date: GenericDate,
	day: GenericDay,
): TheDate;

export function subtractDays(
	...args:
		| [day: number]
		| [date: TheDate | SerializedTheDate, day: number]
) {
	if (args.length === 1) {
		const [day] = args;

		return (date: TheDate | SerializedTheDate) => subtractDays(date, day);
	}

	const [date, day] = args;

	return TheDate.new(toTimestamp(date) - (day * millisecondsInOneDay));
}
