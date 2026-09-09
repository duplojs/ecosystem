import type { SerializedTheDate } from "../types";
import type { TheDate } from "../theDate";
import { toNative } from "../toNative";
import type { Timezone } from "../timezone";

const weekdayMapper = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
} as const;

export function getDayOfWeek<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	timezone?: Timezone,
): number;

export function getDayOfWeek(
	date: TheDate | SerializedTheDate,
	timezone: Timezone = "UTC",
) {
	const nativeDate = toNative(date);

	if (timezone === "UTC") {
		return nativeDate.getUTCDay();
	}

	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		weekday: "long",
	});
	const weekday = formatter.format(nativeDate) as keyof typeof weekdayMapper;

	return weekdayMapper[weekday];
}
