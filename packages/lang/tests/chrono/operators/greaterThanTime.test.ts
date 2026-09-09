import { pipe, type ExpectType, DChrono } from "@scripts";

describe("greaterThanTime", () => {
	const thresholdTime = DChrono.createTime(60, "second");

	it("returns true when input is strictly greater than threshold", () => {
		const result = DChrono.greaterThanTime(
			DChrono.createTime(120, "second"),
			thresholdTime,
		);

		expect(result).toBe(true);

		type check = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("returns false when input equals threshold", () => {
		expect(DChrono.greaterThanTime(thresholdTime, thresholdTime)).toBe(false);
	});

	it("returns false when input is less", () => {
		expect(DChrono.greaterThanTime(DChrono.createTime(30, "second"), thresholdTime)).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createTime(90, "second"),
			DChrono.greaterThanTime(thresholdTime),
		);

		expect(result).toBe(true);
	});
});
