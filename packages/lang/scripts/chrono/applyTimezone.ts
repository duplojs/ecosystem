import { getTimezoneOffset } from "./getTimezoneOffset";
import type { Timezone } from "./timezone";
import { toTimestamp } from "./toTimestamp";
import { TheDate } from "./theDate";
import type { SerializedTheDate } from "./types";

export function applyTimezone(
	timeZone: Timezone,
): (
	date: TheDate | SerializedTheDate,
) => TheDate;

export function applyTimezone(
	date: TheDate | SerializedTheDate,
	timeZone: Timezone,
): TheDate;

export function applyTimezone(
	...args:
		| [timeZone: Timezone]
		| [date: TheDate | SerializedTheDate, timeZone: Timezone]
) {
	if (args.length === 1) {
		const [timeZone] = args;

		return (date: TheDate | SerializedTheDate) => applyTimezone(date, timeZone);
	}

	const [date, timeZone] = args;

	const timestamp = toTimestamp(date);

	return TheDate.new(timestamp - getTimezoneOffset(date, timeZone));
}
