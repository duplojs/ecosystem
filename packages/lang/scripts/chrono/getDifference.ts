import { makeSafeTimeValue } from "./makeSafeTimeValue";
import type { TheDate } from "./theDate";
import { TheTime } from "./theTime";
import { toTimestamp } from "./toTimestamp";
import type { SerializedTheDate } from "./types";

export function getDifference(
	referenceDate: TheDate | SerializedTheDate,
): (
	date: TheDate | SerializedTheDate,
) => TheTime;

export function getDifference(
	date: TheDate | SerializedTheDate,
	referenceDate: TheDate | SerializedTheDate,
): TheTime;

export function getDifference(
	...args:
		| [referenceDate: TheDate | SerializedTheDate]
		| [date: TheDate | SerializedTheDate, referenceDate: TheDate | SerializedTheDate]
) {
	if (args.length === 1) {
		const [referenceDate] = args;

		return (date: TheDate | SerializedTheDate) => getDifference(date, referenceDate);
	}

	const [date, referenceDate] = args;

	const dateTimestamp = toTimestamp(date);
	const referenceTimestamp = toTimestamp(referenceDate);

	return TheTime.new(
		makeSafeTimeValue(dateTimestamp - referenceTimestamp),
	);
}
