import type { SerializedTheDate } from "../types";
import { TheDate } from "../theDate";
import { toNative } from "../toNative";

export function getFirstDayOfWeek<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
): TheDate;

export function getFirstDayOfWeek(
	date: TheDate | SerializedTheDate,
) {
	const nativeDate = toNative(date);
	const dayOfWeek = nativeDate.getUTCDay();
	const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

	nativeDate.setUTCHours(0, 0, 0, 0);
	nativeDate.setUTCDate(nativeDate.getUTCDate() + daysToMonday);

	return TheDate.new(nativeDate.getTime());
}
