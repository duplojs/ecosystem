import { pipe, type ExpectType, DChrono } from "@scripts";

describe("lessThanTime", () => {
	const thresholdTime = DChrono.createTime(60, "second");

	it("returns true when input is strictly less than threshold", () => {
		const result = DChrono.lessThanTime(
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

	it("returns false when input equals threshold", () => {
		expect(DChrono.lessThanTime(thresholdTime, thresholdTime)).toBe(false);
	});

	it("returns false when input is greater", () => {
		expect(DChrono.lessThanTime(DChrono.createTime(90, "second"), thresholdTime)).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createTime(30, "second"),
			DChrono.lessThanTime(thresholdTime),
		);

		expect(result).toBe(true);
	});
});
