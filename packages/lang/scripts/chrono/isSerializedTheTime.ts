import { serializeTheTimeRegex } from "./constants";
import { isSafeTimeValue } from "./isSafeTimeValue";
import type { SerializedTheTime } from "./types";

export function isSerializedTheTime(
	value: string,
): value is SerializedTheTime;

export function isSerializedTheTime(
	value: string,
): boolean {
	const serializeTheTimeMatch = value.match(serializeTheTimeRegex);
	if (serializeTheTimeMatch) {
		const { value: serializedValue, sign } = serializeTheTimeMatch.groups as Record<"value" | "sign", string>;

		return isSafeTimeValue(
			Number(
				sign === "-"
					? `-${serializedValue}`
					: serializedValue,
			),
		);
	}

	return false;
}
