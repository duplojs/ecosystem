import { DCommon, type ExpectType } from "@scripts";

describe("escapeRegExp", () => {
	it("escapes every regexp special character and spaces", () => {
		const result = DCommon.escapeRegExp("a+b [test] (ok)? #value");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("a\\+b\\ \\[test\\]\\ \\(ok\\)\\?\\ \\#value");
	});

	it("keeps regular characters unchanged", () => {
		expect(DCommon.escapeRegExp("abc_123")).toBe("abc_123");
	});
});
