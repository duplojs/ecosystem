import type { SerializedTheDate } from "../types";
import type { TheDate } from "../theDate";
import { toNative } from "../toNative";
import type { Timezone } from "../timezone";

export function getHour<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	timezone?: Timezone,
): number;

export function getHour(
	date: TheDate | SerializedTheDate,
	timezone: Timezone = "UTC",
) {
	const nativeDate = toNative(date);

	if (timezone === "UTC") {
		return nativeDate.getUTCHours();
	}

	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		hour: "numeric",
		hour12: false,
	});

	return Number(formatter.format(nativeDate));
}
