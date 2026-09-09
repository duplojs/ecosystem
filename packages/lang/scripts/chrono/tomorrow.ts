import { millisecondsInOneDay } from "./constants";
import { TheDate } from "./theDate";

export function tomorrow(): TheDate;

export function tomorrow() {
	const timestamp = Date.now() + millisecondsInOneDay;

	return TheDate.new(timestamp);
}
