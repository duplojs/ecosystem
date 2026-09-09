import { TheDate } from "./theDate";
import { TheTime } from "./theTime";
import { toTimestamp } from "./toTimestamp";
import type { SerializedTheDate, SerializedTheTime } from "./types";
import { toTimeValue } from "./toTimeValue";

export function toNative<
	GenericInput extends TheDate | SerializedTheDate,
>(
	input: GenericInput,
): Date;

export function toNative<
	GenericInput extends TheTime | SerializedTheTime,
>(
	input: GenericInput,
): number;

export function toNative(
	input: TheDate | SerializedTheTime | TheTime | SerializedTheDate,
) {
	if (input instanceof TheDate) {
		return input.toNative();
	}

	if (input instanceof TheTime) {
		return input.toNative();
	}

	if (input.startsWith("date")) {
		return new Date(toTimestamp(input as SerializedTheDate));
	}

	return toTimeValue(input as SerializedTheTime);
}
