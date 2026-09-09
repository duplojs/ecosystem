import type { TheDate } from "../theDate";
import { toTimestamp } from "../toTimestamp";
import type { SerializedTheDate } from "../types";

export function betweenThanDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	greater: TheDate | SerializedTheDate,
	less: TheDate | SerializedTheDate,
): (
	date: GenericDate,
) => boolean;

export function betweenThanDate<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	greater: TheDate | SerializedTheDate,
	less: TheDate | SerializedTheDate,
): boolean;

export function betweenThanDate(
	...args:
		| [greater: TheDate | SerializedTheDate, less: TheDate | SerializedTheDate]
		| [date: TheDate | SerializedTheDate, greater: TheDate | SerializedTheDate, less: TheDate | SerializedTheDate]
) {
	if (args.length === 2) {
		const [greater, less] = args;

		return (date: TheDate | SerializedTheDate) => betweenThanDate(date, greater, less);
	}

	const [date, greater, less] = args;

	const dateTimestamp = toTimestamp(date);
	const greaterTimestamp = toTimestamp(greater);
	const lessTimestamp = toTimestamp(less);

	return dateTimestamp > greaterTimestamp && dateTimestamp < lessTimestamp;
}
