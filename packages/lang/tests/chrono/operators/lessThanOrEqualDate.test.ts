import * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";

describe("less", () => {
	const threshold = DChrono.createDate("2024-01-05");

	it("returns true when input is less than threshold", () => {
		const result = DChrono.lessThanOrEqualDate(
			DChrono.createDate("2024-01-01"),
			threshold,
		);

		expect(result).toBe(true);

		type check = DCommon.ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("returns true when input equals threshold", () => {
		expect(DChrono.lessThanOrEqualDate(threshold, threshold)).toBe(true);
	});

	it("returns false when input is greater than threshold", () => {
		expect(DChrono.lessThanOrEqualDate(DChrono.createDate("2024-01-10"), threshold)).toBe(false);
	});

	it("une in pipe", () => {
		const result = DCommon.pipe(
			DChrono.createDate("2024-01-02"),
			DChrono.lessThanOrEqualDate(threshold),
		);

		expect(result).toBe(true);
	});
});
