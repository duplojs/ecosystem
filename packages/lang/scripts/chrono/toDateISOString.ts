import { TheDate } from "./theDate";
import { toNative } from "./toNative";
import type { SerializedTheDate } from "./types";

export function toDateISOString<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
): string;

export function toDateISOString(
	date: TheDate | SerializedTheDate,
) {
	if (date instanceof TheDate) {
		return date.toISOString();
	}

	return toNative(date).toISOString();
}
