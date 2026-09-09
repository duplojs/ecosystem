import type { SerializedTheDate } from "../types";
import type { TheDate } from "../theDate";
import { toNative } from "../toNative";
import type { Timezone } from "../timezone";
import { millisecondsInOneDay } from "../constants";

export function getWeekOfYear<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	timezone?: Timezone,
): number;

export function getWeekOfYear(
	date: TheDate | SerializedTheDate,
	timezone: Timezone = "UTC",
) {
	const nativeDate = toNative(date);

	let year = 0;
	let month = 0;
	let day = 0;

	if (timezone === "UTC") {
		year = nativeDate.getUTCFullYear();
		month = nativeDate.getUTCMonth();
		day = nativeDate.getUTCDate();
	} else {
		const parts = new Intl.DateTimeFormat("en-US", {
			timeZone: timezone,
			day: "numeric",
			year: "numeric",
			month: "numeric",
		}).formatToParts(nativeDate);

		const partsMap = new Map(parts.map((part) => [part.type, part.value]));
		year = Number(partsMap.get("year"));
		month = Number(partsMap.get("month")) - 1;
		day = Number(partsMap.get("day"));
	}

	const weekDate = new Date(Date.UTC(year, month, day));
	const dayOfWeek = weekDate.getUTCDay() || 7;
	const nearestThursday = day + 4 - dayOfWeek;

	weekDate.setUTCDate(nearestThursday);
	const thursYearStart = Date.UTC(weekDate.getUTCFullYear(), 0, 1);
	const millisecondsDiff = weekDate.getTime() - thursYearStart;
	const daysDiff = Math.floor(millisecondsDiff / millisecondsInOneDay);

	return Math.ceil((daysDiff + 1) / 7);
}
