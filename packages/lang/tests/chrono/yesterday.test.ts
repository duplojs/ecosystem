import { type ExpectType, DChrono } from "@scripts";

describe("yesterday", () => {
	it("yesterday returns timestamp of yesterday", () => {
		const before = Date.now() - 86400000;
		const result = DChrono.yesterday();
		const after = Date.now() - 86400000;

		const serialized = DChrono.serialize(result);
		expect(serialized).toMatch(/^date\d+\+$/);

		const timestamp = parseInt(serialized.match(/^date(\d+)\+$/)![1]!);
		expect(timestamp).toBeGreaterThanOrEqual(before - 1000);
		expect(timestamp).toBeLessThanOrEqual(after + 1000);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});
});
