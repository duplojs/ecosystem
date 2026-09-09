import type { SerializedTheDate } from "../types";
import { TheDate } from "../theDate";
import { toNative } from "../toNative";

export function getFirstDayOfMonth<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
): TheDate;

export function getFirstDayOfMonth(
	date: TheDate | SerializedTheDate,
) {
	const nativeDate = toNative(date);

	nativeDate.setUTCDate(1);
	nativeDate.setUTCHours(0, 0, 0, 0);

	return TheDate.new(nativeDate.getTime());
}
