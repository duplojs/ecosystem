import { type ExpectType, DChrono } from "@scripts";

describe("now", () => {
	it("now returns current timestamp", () => {
		const before = Date.now();
		const result = DChrono.now();
		const after = Date.now();

		const serialized = DChrono.serialize(result);
		expect(serialized).toMatch(/^date\d+\+$/);

		const timestamp = parseInt(serialized.match(/^date(\d+)\+$/)![1]!);
		expect(timestamp).toBeGreaterThanOrEqual(before);
		expect(timestamp).toBeLessThanOrEqual(after);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
