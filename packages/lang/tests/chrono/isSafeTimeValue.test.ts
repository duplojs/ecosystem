import { type ExpectType, DChrono } from "@scripts";

describe("isSafeTimeValue", () => {
	it("returns true for safe integers inside bounds", () => {
		const result = DChrono.isSafeTimeValue(0);

		expect(result).toBe(true);
		expect(DChrono.isSafeTimeValue(DChrono.minTimeValue + 1)).toBe(true);
		expect(DChrono.isSafeTimeValue(DChrono.maxTimeValue - 1)).toBe(true);

		type check = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("returns false for non-safe integers", () => {
		expect(DChrono.isSafeTimeValue(1.2)).toBe(false);
		expect(DChrono.isSafeTimeValue(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
	});

	it("returns false at boundaries", () => {
		expect(DChrono.isSafeTimeValue(DChrono.minTimeValue)).toBe(false);
		expect(DChrono.isSafeTimeValue(DChrono.maxTimeValue)).toBe(false);
	});

	it("returns false outside bounds", () => {
		expect(DChrono.isSafeTimeValue(DChrono.minTimeValue - 1)).toBe(false);
		expect(DChrono.isSafeTimeValue(DChrono.maxTimeValue + 1)).toBe(false);
	});
});
