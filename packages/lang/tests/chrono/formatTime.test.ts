import * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";

describe("formatTime", () => {
	it("formats a time using all supported tokens", () => {
		const theTime = DChrono.createTimeOrThrow(788_645_006);
		const result = DChrono.formatTime(theTime, "WW DD HH:mm:ss.SSS");

		expect(result).toBe("01 02 03:04:05.006");

		type check = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("formats negative time values with a leading minus", () => {
		const theTime = DChrono.createTimeOrThrow(-5_000);
		const result = DChrono.formatTime(theTime, "ss.SSS");

		expect(result).toBe("-05.000");
	});

	it("formats with the curried signature in a pipe", () => {
		const theTime = DChrono.createTimeOrThrow(788_645_006);
		const result = DCommon.pipe(
			theTime,
			DChrono.formatTime("HH:mm"),
		);

		expect(result).toBe("03:04");
	});
});
