import { millisecondsInOneDay, millisecondInOneHour, millisecondInOneMinute, millisecondsInOneSecond, millisecondInOneWeek } from "./constants";
import type { TheTime } from "./theTime";
import { toTimeValue } from "./toTimeValue";
import type { SerializedTheTime } from "./types";

export type ComputeTimeUnit = "week" | "day" | "hour" | "minute" | "second" | "millisecond";

const unitMapper = {
	week: 1 / millisecondInOneWeek,
	day: 1 / millisecondsInOneDay,
	hour: 1 / millisecondInOneHour,
	minute: 1 / millisecondInOneMinute,
	second: 1 / millisecondsInOneSecond,
	millisecond: 1,
} as const;

export function computeTime<
	GenericTime extends TheTime | SerializedTheTime,
>(
	unit: ComputeTimeUnit,
): (
	time: GenericTime,
) => number;

export function computeTime(
	time: TheTime | SerializedTheTime,
	unit: ComputeTimeUnit,
): number;

export function computeTime(
	...args:
		| [unit: ComputeTimeUnit]
		| [time: TheTime | SerializedTheTime, unit: ComputeTimeUnit]
) {
	if (args.length === 1) {
		const [unit] = args;

		return (time: TheTime | SerializedTheTime) => computeTime(time, unit);
	}

	const [time, unit] = args;

	return toTimeValue(time) * unitMapper[unit];
}
