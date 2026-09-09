import { type ExpectType, DChrono } from "@scripts";

describe("applyTimezone", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("keeps same value for UTC", () => {
		const theDate = DChrono.createDateOrThrow(1704067200000);
		const result = DChrono.applyTimezone(theDate, "UTC");

		expect(result).toStrictEqual(theDate);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("supports the curried signature", () => {
		const theDate = DChrono.createDateOrThrow(1704067200000);
		const apply = DChrono.applyTimezone("America/New_York");
		const result = apply(theDate);

		const offset = DChrono.getTimezoneOffset(theDate, "America/New_York");
		const expected = DChrono.createDateOrThrow(
			DChrono.toTimestamp(theDate) - offset,
		);

		expect(result).toStrictEqual(expected);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("applies timezone offset for America/New_York", () => {
		const baseDate = DChrono.createDate("2002-09-13");
		const result = DChrono.applyTimezone(baseDate, "Europe/Paris");

		vi.stubEnv("TZ", "Europe/Paris");

		expect(DChrono.toNative(result).getDate()).toBe(13);
		expect(DChrono.toNative(result).getUTCDate()).toBe(12);

		vi.stubEnv("TZ", "UTC");

		expect(DChrono.toNative(result).getDate()).toBe(12);
		expect(DChrono.toNative(result).getUTCDate()).toBe(12);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("is independent from process timezone", () => {
		const baseDate = DChrono.createDateOrThrow(1704067200000);
		const expected = DChrono.applyTimezone(baseDate, "America/New_York");

		vi.stubEnv("TZ", "Pacific/Auckland");
		const result = DChrono.applyTimezone(baseDate, "America/New_York");

		expect(result).toStrictEqual(expected);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
