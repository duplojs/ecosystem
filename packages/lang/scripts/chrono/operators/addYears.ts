import { TheDate } from "../theDate";
import { toNative } from "../toNative";
import type { SerializedTheDate } from "../types";

export function addYears<
	GenericDate extends TheDate | SerializedTheDate,
	GenericYear extends number,
>(
	year: GenericYear,
): (
	date: GenericDate,
) => TheDate;

export function addYears<
	GenericDate extends TheDate | SerializedTheDate,
	GenericYear extends number,
>(
	date: GenericDate,
	year: GenericYear,
): TheDate;

export function addYears(
	...args:
		| [year: number]
		| [date: TheDate | SerializedTheDate, year: number]
) {
	if (args.length === 1) {
		const [year] = args;

		return (date: TheDate | SerializedTheDate) => addYears(date, year);
	}

	const [date, year] = args;

	const nativeDate = toNative(date);
	nativeDate.setUTCFullYear(nativeDate.getUTCFullYear() + year);

	return TheDate.new(nativeDate.getTime());
}
