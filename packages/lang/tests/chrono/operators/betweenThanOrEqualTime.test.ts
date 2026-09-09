import { pipe, type ExpectType, DChrono } from "@scripts";

describe("betweenTime", () => {
	const lowerTime = DChrono.createTime(30, "second");
	const upperTime = DChrono.createTime(90, "second");

	it("returns true when input is within inclusive range", () => {
		const result = DChrono.betweenThanOrEqualTime(
			DChrono.createTime(60, "second"),
			lowerTime,
			upperTime,
		);

		expect(result).toBe(true);

		type check = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("returns true when input equals bounds", () => {
		expect(DChrono.betweenThanOrEqualTime(lowerTime, lowerTime, upperTime)).toBe(true);
		expect(DChrono.betweenThanOrEqualTime(upperTime, lowerTime, upperTime)).toBe(true);
	});

	it("returns false when input is outside range", () => {
		const result = DChrono.betweenThanOrEqualTime(
			DChrono.createTime(120, "second"),
			lowerTime,
			upperTime,
		);

		expect(result).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createTime(60, "second"),
			DChrono.betweenThanOrEqualTime(lowerTime, upperTime),
		);

		expect(result).toBe(true);
	});
});
