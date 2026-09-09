import type { SerializedTheDate } from "../types";
import type { TheDate } from "../theDate";
import { toNative } from "../toNative";

export function getMilliseconds<
	GenericDate extends TheDate | SerializedTheDate,
>(
	date: GenericDate,
): number;

export function getMilliseconds(
	date: TheDate | SerializedTheDate,
) {
	const nativeDate = toNative(date);

	return nativeDate.getUTCMilliseconds();
}
