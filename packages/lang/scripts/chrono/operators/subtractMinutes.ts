import { millisecondInOneMinute } from "../constants";
import { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function subtractMinutes<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMinute extends number,
>(
	minute: GenericMinute,
): (
	date: GenericDate,
) => TheDate;

export function subtractMinutes<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMinute extends number,
>(
	date: GenericDate,
	minute: GenericMinute,
): TheDate;

export function subtractMinutes(
	...args:
		| [minute: number]
		| [date: TheDate | SerializedTheDate, minute: number]
) {
	if (args.length === 1) {
		const [minute] = args;
		return (date: TheDate | SerializedTheDate) => subtractMinutes(date, minute);
	}

	const [date, minute] = args;

	return TheDate.new(toTimestamp(date) - (minute * millisecondInOneMinute));
}
