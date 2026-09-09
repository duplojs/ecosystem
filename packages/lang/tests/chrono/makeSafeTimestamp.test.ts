import { type ExpectType, DChrono } from "@scripts";

describe("makeSafeTimestamp", () => {
	it("returns 0 for NaN", () => {
		const result = DChrono.makeSafeTimestamp(Number.NaN);

		expect(result).toBe(0);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("clamps above maxTimestamp", () => {
		const result = DChrono.makeSafeTimestamp(DChrono.maxTimestamp + 1);

		expect(result).toBe(DChrono.maxTimestamp);

		expect(
			DChrono.makeSafeTimestamp(Infinity),
		).toBe(DChrono.maxTimestamp);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("clamps below minTimestamp", () => {
		const result = DChrono.makeSafeTimestamp(DChrono.minTimestamp - 1);

		expect(result).toBe(DChrono.minTimestamp);

		expect(
			DChrono.makeSafeTimestamp(-Infinity),
		).toBe(DChrono.minTimestamp);

		expect(
			DChrono.makeSafeTimestamp(DChrono.minTimestamp - 1),
		).toBe(DChrono.minTimestamp);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("returns unchanged timestamp within range", () => {
		const value = 1234567890;
		const result = DChrono.makeSafeTimestamp(value);

		expect(result).toBe(value);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("rounds fractional values", () => {
		expect(DChrono.makeSafeTimestamp(1.4)).toBe(1);
		expect(DChrono.makeSafeTimestamp(-2.6)).toBe(-3);
	});

	it("keeps boundary values", () => {
		const maxResult = DChrono.makeSafeTimestamp(DChrono.maxTimestamp);
		const minResult = DChrono.makeSafeTimestamp(DChrono.minTimestamp);

		expect(maxResult).toBe(DChrono.maxTimestamp);
		expect(minResult).toBe(DChrono.minTimestamp);

		type maxCheck = ExpectType<
			typeof maxResult,
			number,
			"strict"
		>;

		type minCheck = ExpectType<
			typeof minResult,
			number,
			"strict"
		>;
	});
});
