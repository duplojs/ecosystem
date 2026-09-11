import * as DChrono from "@duplojs/lang/chrono";

export function getToleranceInSeconds(tolerance?: DChrono.TheTime) {
	return tolerance
		? DChrono.computeTime(tolerance, "second")
		: 0;
}
