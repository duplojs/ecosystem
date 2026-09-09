import type { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function lessThanDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	threshold: TheDate | SerializedTheDate,
): (
	date: GenericDate,
) => boolean;

export function lessThanDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	threshold: TheDate | SerializedTheDate,
): boolean;

export function lessThanDate(
	...args:
		| [threshold: TheDate | SerializedTheDate]
		| [date: TheDate | SerializedTheDate, threshold: TheDate | SerializedTheDate]
) {
	if (args.length === 1) {
		const [threshold] = args;

		return (date: TheDate | SerializedTheDate) => lessThanDate(date, threshold);
	}

	const [date, threshold] = args;

	const dateTimestamp = toTimestamp(date);
	const thresholdTimestamp = toTimestamp(threshold);

	return dateTimestamp < thresholdTimestamp;
}
