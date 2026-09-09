import { pipe, type ExpectType, DChrono } from "@scripts";

describe("toTimestamp", () => {
	it("toTimestamp converts positive TheDate to number", () => {
		const result = DChrono.toTimestamp("date1609459200000+");

		expect(result).toBe(1609459200000);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("toTimestamp converts negative TheDate to number", () => {
		const result = DChrono.toTimestamp("date1000-");

		expect(result).toBe(-1000);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("clamps above maxTimestamp", () => {
		const result = DChrono.toTimestamp("date8640000000000001+");

		expect(result).toBe(DChrono.maxTimestamp);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("clamps below minTimestamp", () => {
		const result = DChrono.toTimestamp("date8640000000000001-");

		expect(result).toBe(DChrono.minTimestamp);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDateOrThrow(1609459200000),
			DChrono.toTimestamp,
		);

		expect(result).toBe(1609459200000);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
