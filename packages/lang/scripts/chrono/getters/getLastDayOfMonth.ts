import type { SerializedTheDate } from "../types";
import { TheDate } from "../theDate";
import { toNative } from "../toNative";

export function getLastDayOfMonth<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
): TheDate;

export function getLastDayOfMonth(
	date: TheDate | SerializedTheDate,
) {
	const nativeDate = toNative(date);

	nativeDate.setUTCMonth(nativeDate.getUTCMonth() + 1, 0);
	nativeDate.setUTCHours(23, 59, 59, 999);

	return TheDate.new(nativeDate.getTime());
}
