import type * as DArray from "@scripts/array";
import { TheTime } from "./theTime";
import type { SerializedTheTime } from "./types";
import { toTimeValue } from "./toTimeValue";

export function maxTime<
	GenericTimes extends (TheTime | SerializedTheTime)[],
>(
	times: GenericTimes & DArray.RequireAtLeastElements<GenericTimes, 1>,
): TheTime;

export function maxTime(
	times: (TheTime | SerializedTheTime)[],
) {
	return TheTime.new(
		Math.max(
			...times.map(toTimeValue),
		),
	);
}
