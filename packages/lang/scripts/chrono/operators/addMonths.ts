import { TheDate } from "../theDate";
import { toNative } from "../toNative";
import type { SerializedTheDate } from "../types";

export function addMonths<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMonth extends number,
>(
	month: GenericMonth,
): (
	date: GenericDate,
) => TheDate;

export function addMonths<
	GenericDate extends TheDate | SerializedTheDate,
	GenericMonth extends number,
>(
	date: GenericDate,
	month: GenericMonth,
): TheDate;

export function addMonths(
	...args:
		| [month: number]
		| [date: TheDate | SerializedTheDate, month: number]
) {
	if (args.length === 1) {
		const [month] = args;

		return (date: TheDate | SerializedTheDate) => addMonths(date, month);
	}

	const [date, month] = args;

	const nativeDate = toNative(date);

	nativeDate.setUTCMonth(nativeDate.getUTCMonth() + month);

	return TheDate.new(nativeDate.getTime());
}
