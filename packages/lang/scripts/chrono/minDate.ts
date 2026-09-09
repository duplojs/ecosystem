import type * as DArray from "@scripts/array";
import { toTimestamp } from "./toTimestamp";
import { TheDate } from "./theDate";
import type { SerializedTheDate } from "./types";

export function minDate<
	GenericDates extends (TheDate | SerializedTheDate)[],
>(
	dates: GenericDates & DArray.RequireAtLeastElements<GenericDates, 1>,
): TheDate;

export function minDate(
	dates: (TheDate | SerializedTheDate)[],
) {
	return TheDate.new(
		Math.min(
			...dates.map(toTimestamp),
		),
	);
}
