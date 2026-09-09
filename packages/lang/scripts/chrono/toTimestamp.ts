import { serializeTheDateRegex } from "./constants";
import { makeSafeTimestamp } from "./makeSafeTimestamp";
import { TheDate } from "./theDate";
import type { SerializedTheDate } from "./types";

export function toTimestamp(
	date: TheDate | SerializedTheDate,
): number;

export function toTimestamp(
	date: TheDate | SerializedTheDate,
) {
	if (date instanceof TheDate) {
		return date.getTime();
	}

	const match = date.match(serializeTheDateRegex);
	const { value, sign } = match!.groups as Record<"value" | "sign", string>;

	return makeSafeTimestamp(
		Number(
			sign === "-"
				? `-${value}`
				: value,
		),
	);
}
