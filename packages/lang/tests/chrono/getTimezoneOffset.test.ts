import { type ExpectType, DChrono } from "@scripts";

describe("getTimezoneOffset", () => {
	it("returns zero for UTC", () => {
		vi.stubEnv("TZ", "UTC");
		const theDate = DChrono.createDateOrThrow(1704067200000);
		const result = DChrono.getTimezoneOffset(theDate, "UTC");

		expect(result).toBe(0);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("returns offset for America/New_York", () => {
		vi.stubEnv("TZ", DChrono.timezone["Europe/Paris"]);

		const theDate = DChrono.createDateOrThrow(1704067200000);
		const result = DChrono.getTimezoneOffset(theDate, "America/New_York");

		expect(result).toBe(-18000000);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("supports the curried signature", () => {
		vi.stubEnv("TZ", "UTC");

		const theDate = DChrono.createDateOrThrow(1704067200000);
		const getOffset = DChrono.getTimezoneOffset("America/New_York");
		const result = getOffset(theDate);

		expect(result).toBe(-18000000);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("accepts serialized dates as input", () => {
		vi.stubEnv("TZ", "UTC");

		const theDate = DChrono.createDateOrThrow(1704067200000);
		const serialized = DChrono.serialize(theDate);
		const result = DChrono.getTimezoneOffset(serialized, "UTC");

		expect(result).toBe(0);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("returns the same value regardless of process timezone", () => {
		vi.stubEnv("TZ", DChrono.timezone["America/New_York"]);
		const theDate = DChrono.createDate("2002-09-13", { hour: "06" });
		const expected = DChrono.getTimezoneOffset(theDate, "America/New_York");

		vi.stubEnv("TZ", "Pacific/Auckland");
		const result = DChrono.getTimezoneOffset(theDate, "America/New_York");

		expect(result).toBe(expected);

		type check = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
