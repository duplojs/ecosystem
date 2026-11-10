import * as DGenerator from "@scripts/generator";
import { millisecondsInOneSecond, millisecondInOneMinute, millisecondInOneHour, millisecondsInOneDay } from "./constants";
import { toTimestamp } from "./toTimestamp";
import { TheDate } from "./theDate";
import type { Unit, SerializedTheDate } from "./types";

const stepMapper: Record<Unit, (timestamp: number, direction: 1 | -1) => number> = {
	millisecond: (timestamp, direction) => timestamp + direction,
	second: (timestamp, direction) => timestamp + (direction * millisecondsInOneSecond),
	minute: (timestamp, direction) => timestamp + (direction * millisecondInOneMinute),
	hour: (timestamp, direction) => timestamp + (direction * millisecondInOneHour),
	day: (timestamp, direction) => timestamp + (direction * millisecondsInOneDay),
	month: (timestamp, direction) => {
		const date = new Date(timestamp);
		date.setUTCMonth(date.getUTCMonth() + direction);
		return date.getTime();
	},
	year: (timestamp, direction) => {
		const date = new Date(timestamp);
		date.setUTCFullYear(date.getUTCFullYear() + direction);
		return date.getTime();
	},
};

export function eachDate(
	range: {
		start: TheDate | SerializedTheDate;
		end: TheDate | SerializedTheDate;
	},
	unit: Unit = "day",
) {
	const startTimestamp = toTimestamp(range.start);
	const endTimestamp = toTimestamp(range.end);

	const direction: 1 | -1 = startTimestamp <= endTimestamp ? 1 : -1;
	const advanceTimestamp = stepMapper[unit];

	return DGenerator.loopAccumulator(
		startTimestamp,
		({
			exit,
			next,
			accumulator,
			count,
		}) => {
			if (count === 0) {
				const startDate = range.start instanceof TheDate
					? range.start
					: TheDate.new(toTimestamp(range.start));
				return next(toTimestamp(startDate), startDate);
			}

			const currentTimestamp = advanceTimestamp(
				accumulator,
				direction,
			);

			const isWithinRange = direction === 1
				? currentTimestamp < endTimestamp
				: currentTimestamp > endTimestamp;

			if (!isWithinRange) {
				return exit(
					currentTimestamp === endTimestamp
						? TheDate.new(currentTimestamp)
						: undefined,
				);
			}

			return next(currentTimestamp, TheDate.new(currentTimestamp));
		},
	);
}
