import type { TheTime } from "../theTime";
import { toTimeValue } from "../toTimeValue";
import type { SerializedTheTime } from "../types";

export function lessThanTime<
	GenericTime extends TheTime | SerializedTheTime,
>(
	threshold: TheTime | SerializedTheTime,
): (
	time: GenericTime,
) => boolean;

export function lessThanTime<
	GenericTime extends TheTime | SerializedTheTime,
>(
	time: GenericTime,
	threshold: TheTime | SerializedTheTime,
): boolean;

export function lessThanTime(
	...args:
		| [threshold: TheTime | SerializedTheTime]
		| [time: TheTime | SerializedTheTime, threshold: TheTime | SerializedTheTime]
) {
	if (args.length === 1) {
		const [threshold] = args;
		return (time: TheTime | SerializedTheTime) => lessThanTime(time, threshold);
	}

	const [time, threshold] = args;

	const timeValue = toTimeValue(time);
	const thresholdTimeValue = toTimeValue(threshold);

	return timeValue < thresholdTimeValue;
}
