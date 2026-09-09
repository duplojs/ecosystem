import { type ExpectType, DChrono } from "@scripts";

describe("makeSafeTimeValue", () => {
	it("returns 0 for NaN", () => {
		const result = DChrono.makeSafeTimeValue(Number.NaN);

		expect(result).toBe(0);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("clamps above maxTimeValue", () => {
		const result = DChrono.makeSafeTimeValue(DChrono.maxTimeValue + 1);

		expect(result).toBe(DChrono.maxTimeValue);
		expect(DChrono.makeSafeTimeValue(Infinity)).toBe(DChrono.maxTimeValue);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("clamps below minTimeValue", () => {
		const result = DChrono.makeSafeTimeValue(DChrono.minTimeValue - 1);

		expect(result).toBe(DChrono.minTimeValue);
		expect(DChrono.makeSafeTimeValue(-Infinity)).toBe(DChrono.minTimeValue);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("returns integers within range", () => {
		const value = 123456;
		const result = DChrono.makeSafeTimeValue(value);

		expect(result).toBe(value);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("rounds fractional values", () => {
		expect(DChrono.makeSafeTimeValue(1.4)).toBe(1);
		expect(DChrono.makeSafeTimeValue(-2.6)).toBe(-3);
	});
});
