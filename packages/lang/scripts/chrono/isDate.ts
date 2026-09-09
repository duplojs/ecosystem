import { TheDate } from "./theDate";

export function isDate(
	value: unknown,
): value is TheDate;

export function isDate(
	value: unknown,
): boolean {
	return value instanceof TheDate;
}
