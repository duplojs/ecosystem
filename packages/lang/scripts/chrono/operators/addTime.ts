import { isSerializedTheTime } from "../isSerializedTheTime";
import { TheDate } from "../theDate";
import { TheTime } from "../theTime";
import { toTimestamp } from "../toTimestamp";
import { toTimeValue } from "../toTimeValue";
import type { SerializedTheDate, SerializedTheTime } from "../types";

export function addTime<
	GenericInput extends (
		| TheDate
		| SerializedTheDate
		| TheTime
		| SerializedTheTime
	),
>(
	time: TheTime | SerializedTheTime,
): (
	input: GenericInput,
) => (
	GenericInput extends (
		| TheDate
		| SerializedTheDate
	)
		? TheDate
		: GenericInput extends (
			| TheTime
			| SerializedTheTime
		)
			? TheTime
			: never
);

export function addTime<
	GenericInput extends (
		| TheDate
		| SerializedTheDate
		| TheTime
		| SerializedTheTime
	),
>(
	input: GenericInput,
	time: TheTime | SerializedTheTime,
): (
	GenericInput extends (
		| TheDate
		| SerializedTheDate
	)
		? TheDate
		: GenericInput extends (
			| TheTime
			| SerializedTheTime
		)
			? TheTime
			: never
);

export function addTime(
	...args:
		| [time: TheTime | SerializedTheTime]
		| [input: TheDate | SerializedTheDate | TheTime | SerializedTheTime, time: TheTime | SerializedTheTime]
): any {
	if (args.length === 1) {
		const [time] = args;

		return (input: TheDate | SerializedTheDate | TheTime | SerializedTheTime) => addTime(input as never, time);
	}

	const [input, time] = args;

	const timeValue = toTimeValue(time);

	if (input instanceof TheDate) {
		const timestamp = toTimestamp(input);

		return TheDate.new(timestamp + timeValue);
	}

	if (input instanceof TheTime || isSerializedTheTime(input)) {
		const inputTimeValue = toTimeValue(input);

		return TheTime.new(inputTimeValue + timeValue);
	}

	const timestamp = toTimestamp(input);

	return TheDate.new(timestamp + timeValue);
}
