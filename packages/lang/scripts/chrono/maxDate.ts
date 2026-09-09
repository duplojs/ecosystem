import type * as DArray from "@scripts/array";
import { TheDate } from "./theDate";
import { toTimestamp } from "./toTimestamp";
import type { SerializedTheDate } from "./types";

export function maxDate<
	GenericDates extends (TheDate | SerializedTheDate)[],
>(
	dates: GenericDates & DArray.RequireAtLeastElements<GenericDates, 1>,
): TheDate;

export function maxDate(
	dates: (TheDate | SerializedTheDate)[],
) {
	return TheDate.new(
		Math.max(
			...dates.map(toTimestamp),
		),
	);
}
