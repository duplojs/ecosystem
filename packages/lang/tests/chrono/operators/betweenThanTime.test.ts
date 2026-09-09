import { pipe, type ExpectType, DChrono } from "@scripts";

describe("betweenThanTime", () => {
	const lowerTime = DChrono.createTime(30, "second");
	const upperTime = DChrono.createTime(90, "second");

	it("returns true when input is strictly within range", () => {
		const result = DChrono.betweenThanTime(
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

	it("returns false when input equals bounds", () => {
		expect(DChrono.betweenThanTime(lowerTime, lowerTime, upperTime)).toBe(false);
		expect(DChrono.betweenThanTime(upperTime, lowerTime, upperTime)).toBe(false);
	});

	it("returns false when input is outside range", () => {
		const result = DChrono.betweenThanTime(
			DChrono.createTime(120, "second"),
			lowerTime,
			upperTime,
		);

		expect(result).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createTime(60, "second"),
			DChrono.betweenThanTime(lowerTime, upperTime),
		);

		expect(result).toBe(true);
	});
});
