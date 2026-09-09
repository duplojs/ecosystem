import { DCommon, type ExpectType } from "@scripts";

describe("toRegExp", () => {
	it("creates an exact regexp from a string", () => {
		const result = DCommon.toRegExp("a+b");

		type _CheckResult = ExpectType<
			typeof result,
			RegExp,
			"strict"
		>;

		expect(result.test("a+b")).toBe(true);
		expect(result.test("aaab")).toBe(false);
	});

	it("creates an exact regexp from a string tuple", () => {
		const result = DCommon.toRegExp(["a+b", "c.d"] as const);

		expect(result.test("a+b")).toBe(true);
		expect(result.test("c.d")).toBe(true);
		expect(result.test("cxd")).toBe(false);
	});

	it("returns regexp inputs directly", () => {
		const input = /^value$/;

		expect(DCommon.toRegExp(input)).toBe(input);
	});
});
