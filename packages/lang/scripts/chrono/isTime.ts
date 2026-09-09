import { TheTime } from "./theTime";

export function isTime(
	value: unknown,
): value is TheTime;

export function isTime(
	value: unknown,
): boolean {
	return value instanceof TheTime;
}
