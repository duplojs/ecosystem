import { serializeTheDateRegex } from "./constants";
import { isSafeTimestamp } from "./isSafeTimestamp";
import type { SerializedTheDate } from "./types";

export function isSerializedTheDate(
	value: string,
): value is SerializedTheDate;

export function isSerializedTheDate(
	value: string,
): boolean {
	const serializeTheDateMatch = value.match(serializeTheDateRegex);
	if (serializeTheDateMatch) {
		const { value: serializedValue, sign } = serializeTheDateMatch.groups as Record<"value" | "sign", string>;

		return isSafeTimestamp(
			Number(
				sign === "-"
					? `-${serializedValue}`
					: serializedValue,
			),
		);
	}

	return false;
}
