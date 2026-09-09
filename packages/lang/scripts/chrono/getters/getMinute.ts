import type { SerializedTheDate } from "../types";
import type { TheDate } from "../theDate";
import { toNative } from "../toNative";
import type { Timezone } from "../timezone";

export function getMinute<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
	timezone?: Timezone,
): number;

export function getMinute(
	date: TheDate | SerializedTheDate,
	timezone: Timezone = "UTC",
) {
	const nativeDate = toNative(date);

	if (timezone === "UTC") {
		return nativeDate.getUTCMinutes();
	}

	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		minute: "numeric",
	});

	return Number(formatter.format(nativeDate));
}
