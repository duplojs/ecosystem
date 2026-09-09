import { DChrono, pipe, type ExpectType } from "@scripts";

describe("getDifference", () => {
	it("returns signed difference in milliseconds with classic call", () => {
		const result = DChrono.getDifference(
			DChrono.createDate("2024-01-03"),
			DChrono.createDate("2024-01-01"),
		);

		expect(result.toNative()).toBe(172800000);

		type check = ExpectType<
			typeof result,
			DChrono.TheTime,
			"strict"
		>;
	});

	it("returns negative difference when input is before reference", () => {
		const result = DChrono.getDifference(
			DChrono.createDate("2024-01-01"),
			DChrono.createDate("2024-01-03"),
		);

		expect(result.toNative()).toBe(-172800000);
	});

	it("supports serialized values", () => {
		const result = DChrono.getDifference(
			"date172800000+",
			"date86400000+",
		);

		expect(result.toNative()).toBe(86400000);
	});

	it("clamps when difference is above max safe time value", () => {
		const result = DChrono.getDifference(
			"date8640000000000000+",
			"date8640000000000000-",
		);

		expect(result.toNative()).toBe(DChrono.maxTimeValue);
	});

	it("clamps when difference is below min safe time value", () => {
		const result = DChrono.getDifference(
			"date8640000000000000-",
			"date8640000000000000+",
		);

		expect(result.toNative()).toBe(DChrono.minTimeValue);
	});

	it("works in pipe with curried overload", () => {
		const result = pipe(
			DChrono.createDate("2024-01-03"),
			DChrono.getDifference(DChrono.createDate("2024-01-01")),
		);

		expect(result.toNative()).toBe(172800000);

		type check = ExpectType<
			typeof result,
			DChrono.TheTime,
			"strict"
		>;
	});
});
