import { type ExpectType, DChrono } from "@scripts";

describe("today", () => {
	it("today returns current day at midnight UTC", () => {
		const result = DChrono.today();

		const serialized = DChrono.serialize(result);
		expect(serialized).toMatch(/^date\d+\+$/);

		const timestamp = parseInt(serialized.match(/^date(\d+)\+$/)![1]!);
		const nativeDate = new Date(timestamp);

		expect(nativeDate.getUTCHours()).toBe(0);
		expect(nativeDate.getUTCMinutes()).toBe(0);
		expect(nativeDate.getUTCSeconds()).toBe(0);
		expect(nativeDate.getUTCMilliseconds()).toBe(0);

		const expectedTimestamp = new Date().setUTCHours(0, 0, 0, 0);
		expect(timestamp).toBe(expectedTimestamp);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
