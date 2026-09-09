import { millisecondInOneWeek } from "../constants";
import { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function subtractWeeks<
	GenericDate extends TheDate | SerializedTheDate,
	GenericWeek extends number,
>(
	week: GenericWeek,
): (
	date: GenericDate,
) => TheDate;

export function subtractWeeks<
	GenericDate extends TheDate | SerializedTheDate,
	GenericWeek extends number,
>(
	date: GenericDate,
	week: GenericWeek,
): TheDate;

export function subtractWeeks(
	...args:
		| [week: number]
		| [date: TheDate | SerializedTheDate, week: number]
) {
	if (args.length === 1) {
		const [week] = args;

		return (date: TheDate | SerializedTheDate) => subtractWeeks(date, week);
	}

	const [date, week] = args;

	return TheDate.new(toTimestamp(date) - (week * millisecondInOneWeek));
}
