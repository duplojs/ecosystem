import type { SerializedTheDate } from "../types";
import type { TheDate } from "../theDate";
import type { Timezone } from "../timezone";
import { toNative } from "../toNative";

export function getDayOfMonth<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	timezone?: Timezone,
): number;

export function getDayOfMonth(
	date: TheDate | SerializedTheDate,
	timezone: Timezone = "UTC",
) {
	const nativeDate = toNative(date);

	if (timezone === "UTC") {
		return nativeDate.getUTCDate();
	}

	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		day: "numeric",
	});

	return Number(formatter.format(nativeDate));
}
