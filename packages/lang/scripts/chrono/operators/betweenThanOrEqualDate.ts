import type { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function betweenThanOrEqualDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	greater: TheDate | SerializedTheDate,
	less: TheDate | SerializedTheDate,
): (
	date: GenericDate,
) => boolean;

export function betweenThanOrEqualDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	greater: TheDate | SerializedTheDate,
	less: TheDate | SerializedTheDate,
): boolean;

export function betweenThanOrEqualDate(
	...args:
		| [greater: TheDate | SerializedTheDate, less: TheDate | SerializedTheDate]
		| [date: TheDate | SerializedTheDate, greater: TheDate | SerializedTheDate, less: TheDate | SerializedTheDate]
) {
	if (args.length === 2) {
		const [greater, less] = args;

		return (date: TheDate | SerializedTheDate) => betweenThanOrEqualDate(date, greater, less);
	}

	const [date, greater, less] = args;

	const dateTimestamp = toTimestamp(date);
	const greaterTimestamp = toTimestamp(greater);
	const lessTimestamp = toTimestamp(less);

	return dateTimestamp >= greaterTimestamp && dateTimestamp <= lessTimestamp;
}
