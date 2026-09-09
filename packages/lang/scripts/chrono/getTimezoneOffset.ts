import type { Timezone } from "./timezone";
import { TheDate } from "./theDate";
import type { SerializedTheDate } from "./types";
import { toNative } from "./toNative";

export function getTimezoneOffset(
	timeZone: Timezone,
): (
	date: TheDate | SerializedTheDate,
) => number;

export function getTimezoneOffset(
	date: TheDate | SerializedTheDate,
	timeZone: Timezone,
): number;

export function getTimezoneOffset(
	...args:
		| [timeZone: Timezone]
		| [date: TheDate | SerializedTheDate, timeZone: Timezone]
) {
	if (args.length === 1) {
		const [timeZone] = args;

		return (date: TheDate | SerializedTheDate) => getTimezoneOffset(date, timeZone);
	}

	const [date, timeZone] = args;

	const nativeDate = date instanceof TheDate
		? date
		: toNative(date);

	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hour12: false,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	const parts = Object.fromEntries(
		formatter.formatToParts(nativeDate).map((part) => [part.type, part.value]),
	);

	const tzDateAsUTC = Date.UTC(
		Number(parts.year),
		Number(parts.month) - 1,
		Number(parts.day),
		Number(parts.hour),
		Number(parts.minute),
		Number(parts.second),
	);

	return tzDateAsUTC - nativeDate.getTime();
}
