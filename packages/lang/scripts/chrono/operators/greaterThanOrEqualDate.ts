import type { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function greaterThanOrEqualDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	threshold: TheDate | SerializedTheDate,
): (
	date: GenericDate,
) => boolean;

export function greaterThanOrEqualDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	threshold: TheDate | SerializedTheDate,
): boolean;

export function greaterThanOrEqualDate(
	...args:
		| [threshold: TheDate | SerializedTheDate]
		| [date: TheDate | SerializedTheDate, threshold: TheDate | SerializedTheDate]
) {
	if (args.length === 1) {
		const [threshold] = args;

		return (date: TheDate | SerializedTheDate) => greaterThanOrEqualDate(date, threshold);
	}

	const [date, threshold] = args;

	const dateTimestamp = toTimestamp(date);
	const thresholdTimestamp = toTimestamp(threshold);

	return dateTimestamp >= thresholdTimestamp;
}
