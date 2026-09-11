import * as DChrono from "@duplojs/lang/chrono";

export function nowInSeconds(func?: () => DChrono.TheDate) {
	const now = func?.() ?? DChrono.now();

	return Math.floor(DChrono.toTimestamp(now) / 1000);
}
