import { TheDate } from "./theDate";

export function now(): TheDate;

export function now() {
	const timestamp = Date.now();

	return TheDate.new(timestamp);
}
