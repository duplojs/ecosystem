import { pipe, type ExpectType, DChrono } from "@scripts";

describe("lessTime", () => {
	const thresholdTime = DChrono.createTime(60, "second");

	it("returns true when input is less than threshold", () => {
		const result = DChrono.lessThanOrEqualTime(
			DChrono.createTime(30, "second"),
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
		expect(DChrono.lessThanOrEqualTime(thresholdTime, thresholdTime)).toBe(true);
	});

	it("returns false when input is greater than threshold", () => {
		expect(DChrono.lessThanOrEqualTime(DChrono.createTime(90, "second"), thresholdTime)).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createTime(30, "second"),
			DChrono.lessThanOrEqualTime(thresholdTime),
		);

		expect(result).toBe(true);
	});
});
