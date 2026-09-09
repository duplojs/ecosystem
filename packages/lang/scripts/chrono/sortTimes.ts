import type * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";
import { toTimeValue } from "./toTimeValue";
import { TheTime } from "./theTime";
import type { SerializedTheTime } from "./types";

export function sortTimes<
	GenericTimes extends readonly (TheTime | SerializedTheTime)[],
>(
	type: DCommon.SortType,
): (
	times: GenericTimes & DArray.RequireAtLeastElements<GenericTimes, 1>,
) => TheTime[];

export function sortTimes<
	GenericTimes extends readonly (TheTime | SerializedTheTime)[],
>(
	times: GenericTimes & DArray.RequireAtLeastElements<GenericTimes, 1>,
	type: DCommon.SortType,
): TheTime[];

export function sortTimes(
	...args:
		| [type: DCommon.SortType]
		| [times: readonly (TheTime | SerializedTheTime)[], type: DCommon.SortType]
) {
	if (args.length === 1) {
		const [type] = args;

		return (times: readonly (TheTime | SerializedTheTime)[]) => sortTimes(times as never, type);
	}

	const [times, type] = args;

	return times
		.map(toTimeValue)
		.sort(
			type === "DSC"
				? (first, second) => second - first
				: (first, second) => first - second,
		)
		.map(TheTime.new);
}
