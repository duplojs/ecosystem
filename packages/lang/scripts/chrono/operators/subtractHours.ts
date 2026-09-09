import { millisecondInOneHour } from "../constants";
import { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function subtractHours<
	GenericDate extends TheDate | SerializedTheDate,
	GenericHour extends number,
>(
	hour: GenericHour,
): (
	date: GenericDate,
) => TheDate;

export function subtractHours<
	GenericDate extends TheDate | SerializedTheDate,
	GenericHour extends number,
>(
	date: GenericDate,
	hour: GenericHour,
): TheDate;

export function subtractHours(
	...args:
		| [hour: number]
		| [date: TheDate | SerializedTheDate, hour: number]
) {
	if (args.length === 1) {
		const [hour] = args;

		return (date: TheDate | SerializedTheDate) => subtractHours(date, hour);
	}

	const [date, hour] = args;

	return TheDate.new(toTimestamp(date) - (hour * millisecondInOneHour));
}
