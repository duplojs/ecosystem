import type { SerializedTheDate } from "../types";
import { TheDate } from "../theDate";
import { toNative } from "../toNative";

export function getLastDayOfWeek<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
): TheDate;

export function getLastDayOfWeek(
	date: TheDate | SerializedTheDate,
) {
	const nativeDate = toNative(date);
	const dayOfWeek = nativeDate.getUTCDay();
	const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

	nativeDate.setUTCDate(nativeDate.getUTCDate() + daysToSunday);
	nativeDate.setUTCHours(23, 59, 59, 999);

	return TheDate.new(nativeDate.getTime());
}
