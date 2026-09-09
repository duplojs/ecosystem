import type { TheTime } from "../theTime";
import { toTimeValue } from "../toTimeValue";
import type { SerializedTheTime } from "../types";

export function betweenThanOrEqualTime<
	GenericTime extends TheTime | SerializedTheTime,
>(
	greater: TheTime | SerializedTheTime,
	less: TheTime | SerializedTheTime,
): (
	time: GenericTime,
) => boolean;

export function betweenThanOrEqualTime<
	GenericTime extends TheTime | SerializedTheTime,
>(
	time: GenericTime,
	greater: TheTime | SerializedTheTime,
	less: TheTime | SerializedTheTime,
): boolean;

export function betweenThanOrEqualTime(
	...args:
		| [greater: TheTime | SerializedTheTime, less: TheTime | SerializedTheTime]
		| [time: TheTime | SerializedTheTime, greater: TheTime | SerializedTheTime, less: TheTime | SerializedTheTime]
) {
	if (args.length === 2) {
		const [greater, less] = args;

		return (time: TheTime | SerializedTheTime) => betweenThanOrEqualTime(time, greater, less);
	}

	const [time, greater, less] = args;

	const timeValue = toTimeValue(time);
	const greaterTimeValue = toTimeValue(greater);
	const lessTimeValue = toTimeValue(less);

	return timeValue >= greaterTimeValue && timeValue <= lessTimeValue;
}
