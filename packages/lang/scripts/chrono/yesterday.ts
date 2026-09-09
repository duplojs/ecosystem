import { millisecondsInOneDay } from "./constants";
import { TheDate } from "./theDate";

export function yesterday(): TheDate;

export function yesterday() {
	const timestamp = Date.now() - millisecondsInOneDay;

	return TheDate.new(timestamp);
}
