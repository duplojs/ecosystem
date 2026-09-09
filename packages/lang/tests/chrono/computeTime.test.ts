import { DChrono, pipe, type ExpectType } from "@scripts";

describe("computeTime", () => {
	it("converts TheTime to requested unit with classic call", () => {
		const input = DChrono.createTime(604_800_000, "millisecond");
		const result = DChrono.computeTime(input, "day");

		expect(result).toBe(7);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("converts serialized TheTime to requested unit", () => {
		const result = DChrono.computeTime("time3600000-", "minute");

		expect(result).toBe(-60);
	});

	it("supports all supported units", () => {
		const input = DChrono.createTime(604800000, "millisecond");

		expect(DChrono.computeTime(input, "week")).toBe(1);
		expect(DChrono.computeTime(input, "day")).toBe(7);
		expect(DChrono.computeTime(input, "hour")).toBe(168);
		expect(DChrono.computeTime(input, "minute")).toBe(10_080);
		expect(DChrono.computeTime(input, "second")).toBe(604_800);
		expect(DChrono.computeTime(input, "millisecond")).toBe(604_800_000);
	});

	it("works in pipe with curried overload", () => {
		const result = pipe(
			DChrono.createTime(7_200_000, "millisecond"),
			DChrono.computeTime("hour"),
		);

		expect(result).toBeCloseTo(2);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
