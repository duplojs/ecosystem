import { makeSafeTimeValue } from "./makeSafeTimeValue";
import { TheTime } from "./theTime";
import { serializeTheTimeRegex } from "./constants";
import type { SerializedTheTime } from "./types";

export function toTimeValue(
	time: TheTime | SerializedTheTime,
): number;

export function toTimeValue(
	time: TheTime | SerializedTheTime,
) {
	if (time instanceof TheTime) {
		return time.toNative();
	}

	const match = time.match(serializeTheTimeRegex);
	const { value, sign } = match!.groups as Record<"value" | "sign", string>;

	return makeSafeTimeValue(
		Number(
			sign === "-"
				? `-${value}`
				: value,
		),
	);
}
