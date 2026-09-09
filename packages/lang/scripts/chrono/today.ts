import { TheDate } from "./theDate";

export function today(): TheDate;

export function today() {
	const timestamp = new Date().setUTCHours(0, 0, 0, 0);

	return TheDate.new(timestamp);
}
