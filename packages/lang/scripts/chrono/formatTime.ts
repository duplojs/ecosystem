import { millisecondInOneHour, millisecondInOneMinute, millisecondInOneWeek, millisecondsInOneDay, millisecondsInOneSecond } from "./constants";
import type { TheTime } from "./theTime";
import { toTimeValue } from "./toTimeValue";
import type { SerializedTheTime } from "./types";

const formatStringRegex = /WW|DD|HH|mm|ss|SSS/g;

type FormatToken = "WW" | "DD" | "HH" | "mm" | "ss" | "SSS";

export function formatTime<
	GenericTime extends TheTime | SerializedTheTime,
	GenericFormat extends string,
>(
	formatString: GenericFormat,
): (
	time: GenericTime,
) => string;

export function formatTime<
	GenericTime extends TheTime | SerializedTheTime,
	GenericFormat extends string,
>(
	time: GenericTime,
	formatString: GenericFormat,
): string;

export function formatTime(
	...args:
		| [formatString: string]
		| [time: TheTime | SerializedTheTime, formatString: string]
) {
	if (args.length === 1) {
		const [formatString] = args;

		return (time: TheTime | SerializedTheTime) => formatTime(time, formatString);
	}

	const [time, formatString] = args;
	const timeValue = toTimeValue(time);

	const isNegative = timeValue < 0;
	let remaining = Math.abs(timeValue);

	const weeks = Math.floor(remaining / millisecondInOneWeek);
	remaining -= weeks * millisecondInOneWeek;

	const days = Math.floor(remaining / millisecondsInOneDay);
	remaining -= days * millisecondsInOneDay;

	const hours = Math.floor(remaining / millisecondInOneHour);
	remaining -= hours * millisecondInOneHour;

	const minutes = Math.floor(remaining / millisecondInOneMinute);
	remaining -= minutes * millisecondInOneMinute;

	const seconds = Math.floor(remaining / millisecondsInOneSecond);
	remaining -= seconds * millisecondsInOneSecond;

	const tokens: Record<FormatToken, string> = {
		WW: weeks.toString().padStart(2, "0"),
		DD: days.toString().padStart(2, "0"),
		HH: hours.toString().padStart(2, "0"),
		mm: minutes.toString().padStart(2, "0"),
		ss: seconds.toString().padStart(2, "0"),
		SSS: remaining.toString().padStart(3, "0"),
	};

	const formatted = formatString.replace(
		formatStringRegex,
		(token) => tokens[token as FormatToken],
	);

	return isNegative ? `-${formatted}` : formatted;
}
