import { type ExpectType, DChrono } from "@scripts";

describe("isSafeTimestamp", () => {
	it("returns true for safe timestamp within range", () => {
		const result = DChrono.isSafeTimestamp(0);

		expect(result).toBe(true);

		type check = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("returns false for non-safe integer", () => {
		const result = DChrono.isSafeTimestamp(Number.MAX_SAFE_INTEGER + 1);

		expect(result).toBe(false);
	});

	it("returns false when below minTimestamp", () => {
		const belowMin = DChrono.minTimestamp - 1;

		expect(DChrono.isSafeTimestamp(belowMin)).toBe(false);
	});

	it("returns false when above maxTimestamp", () => {
		const aboveMax = DChrono.maxTimestamp + 1;

		expect(DChrono.isSafeTimestamp(aboveMax)).toBe(false);
	});

	it("returns false at min/max boundaries", () => {
		expect(DChrono.isSafeTimestamp(DChrono.minTimestamp)).toBe(false);
		expect(DChrono.isSafeTimestamp(DChrono.maxTimestamp)).toBe(false);
	});
});
