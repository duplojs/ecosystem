import { millisecondInOneWeek } from "../constants";
import { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function addWeeks<
	GenericDate extends TheDate | SerializedTheDate,
	GenericWeek extends number,
>(
	week: GenericWeek,
): (
	date: GenericDate,
) => TheDate;

export function addWeeks<
	GenericDate extends TheDate | SerializedTheDate,
	GenericWeek extends number,
>(
	date: GenericDate,
	week: GenericWeek,
): TheDate;

export function addWeeks(
	...args:
		| [week: number]
		| [date: TheDate | SerializedTheDate, week: number]
) {
	if (args.length === 1) {
		const [week] = args;

		return (date: TheDate | SerializedTheDate) => addWeeks(date, week);
	}

	const [date, week] = args;

	const timestamp = date instanceof TheDate
		? date.getTime()
		: toTimestamp(date);

	return TheDate.new(timestamp + (week * millisecondInOneWeek));
}
