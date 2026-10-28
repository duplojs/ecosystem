import * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";

describe("greater", () => {
	const threshold = DChrono.createDate("2024-01-05");

	it("returns true when input is greater than threshold", () => {
		const result = DChrono.greaterThanOrEqualDate(
			DChrono.createDate("2024-01-06"),
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
		expect(DChrono.greaterThanOrEqualDate(threshold, threshold)).toBe(true);
	});

	it("returns false when input is less than threshold", () => {
		expect(DChrono.greaterThanOrEqualDate(DChrono.createDate("2024-01-01"), threshold)).toBe(false);
	});

	it("use in pipe", () => {
		const result = DCommon.pipe(
			DChrono.createDate("2024-01-10"),
			DChrono.greaterThanOrEqualDate(threshold),
		);

		expect(result).toBe(true);
	});
});
