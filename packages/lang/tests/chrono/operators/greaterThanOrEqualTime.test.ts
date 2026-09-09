import { pipe, type ExpectType, DChrono } from "@scripts";

describe("greaterTime", () => {
	const thresholdTime = DChrono.createTime(60, "second");

	it("returns true when input is greater than threshold", () => {
		const result = DChrono.greaterThanOrEqualTime(
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

	it("returns true when input equals threshold", () => {
		expect(DChrono.greaterThanOrEqualTime(thresholdTime, thresholdTime)).toBe(true);
	});

	it("returns false when input is less than threshold", () => {
		expect(DChrono.greaterThanOrEqualTime(DChrono.createTime(30, "second"), thresholdTime)).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createTime(90, "second"),
			DChrono.greaterThanOrEqualTime(thresholdTime),
		);

		expect(result).toBe(true);
	});
});
