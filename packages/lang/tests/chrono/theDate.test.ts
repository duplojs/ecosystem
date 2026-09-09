import { DChrono, type ExpectType, pipe } from "@scripts";

describe("TheDate", () => {
	it("returns a native Date with the same timestamp", () => {
		const baseDate = DChrono.createDate("2020-01-01");

		const result = baseDate.toNative();

		expect(result).toBeInstanceOf(Date);
		expect(result.getTime()).toBe(baseDate.getTime());

		type check = ExpectType<
			typeof result,
			Date,
			"strict"
		>;
	});

	it("serializes with toString and toJSON", () => {
		const baseDate = DChrono.createDate("2020-01-01");

		const asString = baseDate.toString();
		const asJson = baseDate.toJSON();

		expect(asString).toBe(DChrono.serialize(baseDate));
		expect(asJson).toBe(DChrono.serialize(baseDate));

		type check = ExpectType<
			typeof asString,
			DChrono.SerializedTheDate,
			"strict"
		>;
	});

	it("prevents mutation through deprecated setters", () => {
		const baseDate = DChrono.createDate("2020-01-01");
		const baseTimestamp = baseDate.getTime();

		expect(baseDate.setDate()).toBe(baseTimestamp);
		expect(baseDate.setFullYear()).toBe(baseTimestamp);
		expect(baseDate.setHours()).toBe(baseTimestamp);
		expect(baseDate.setMilliseconds()).toBe(baseTimestamp);
		expect(baseDate.setMinutes()).toBe(baseTimestamp);
		expect(baseDate.setMonth()).toBe(baseTimestamp);
		expect(baseDate.setSeconds()).toBe(baseTimestamp);
		expect(baseDate.setTime()).toBe(baseTimestamp);
		expect(baseDate.setUTCDate()).toBe(baseTimestamp);
		expect(baseDate.setUTCFullYear()).toBe(baseTimestamp);
		expect(baseDate.setUTCHours()).toBe(baseTimestamp);
		expect(baseDate.setUTCMilliseconds()).toBe(baseTimestamp);
		expect(baseDate.setUTCMinutes()).toBe(baseTimestamp);
		expect(baseDate.setUTCMonth()).toBe(baseTimestamp);
		expect(baseDate.setUTCSeconds()).toBe(baseTimestamp);

		expect(baseDate.getTime()).toBe(baseTimestamp);
	});

	it("works inside pipe with instance methods", () => {
		const baseDate = DChrono.createDate("2020-01-01");

		const result = pipe(
			baseDate,
			(value) => value.toNative(),
		);

		expect(result.getTime()).toBe(baseDate.getTime());

		type check = ExpectType<
			typeof result,
			Date,
			"strict"
		>;
	});
});
