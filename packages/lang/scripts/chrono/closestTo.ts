import { TheDate } from "./theDate";
import { toTimestamp } from "./toTimestamp";
import type { SerializedTheDate } from "./types";

export interface ClosestToParams {
	tieBreaker?: "favorPast" | "favorFuture";
}

export function closestTo(
	targetDate: TheDate | SerializedTheDate,
	params?: ClosestToParams,
): (
	dates: Iterable<TheDate | SerializedTheDate>,
) => TheDate | undefined;

export function closestTo(
	dates: Iterable<TheDate | SerializedTheDate>,
	targetDate: TheDate | SerializedTheDate,
	params?: ClosestToParams,
): TheDate | undefined;

export function closestTo(
	...args:
		| [targetDate: TheDate | SerializedTheDate, params?: ClosestToParams]
		| [
			dates: Iterable<TheDate | SerializedTheDate>,
			targetDate: TheDate | SerializedTheDate,
			params?: ClosestToParams,
		]
) {
	if (typeof args[0] === "string" || args[0] instanceof TheDate) {
		const [targetDate, params] = args as [
			TheDate | SerializedTheDate,
			ClosestToParams?,
		];

		return (dates: Iterable<TheDate | SerializedTheDate>) => closestTo(dates, targetDate, params);
	}

	const [dates, targetDate, params] = args as [
		Iterable<TheDate | SerializedTheDate>,
		TheDate | SerializedTheDate,
		ClosestToParams?,
	];

	const { tieBreaker } = params ?? {};

	const targetTimestamp = toTimestamp(targetDate);

	let closest: TheDate | undefined = undefined;
	let smallestDiff = Number.POSITIVE_INFINITY;

	for (const date of dates) {
		const dateTimestamp = toTimestamp(date);
		if (tieBreaker === "favorPast" && dateTimestamp > targetTimestamp) {
			continue;
		}

		if (tieBreaker === "favorFuture" && dateTimestamp < targetTimestamp) {
			continue;
		}

		const distance = Math.abs(dateTimestamp - targetTimestamp);

		if (distance < smallestDiff) {
			smallestDiff = distance;
			closest = date instanceof TheDate
				? date
				: TheDate.new(dateTimestamp);
		}
	}

	return closest;
}
