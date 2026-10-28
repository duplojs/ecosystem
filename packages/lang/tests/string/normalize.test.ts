import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("normalize", () => {
	it("should normalize a string", () => {
		const result = DString.normalize("\u00E9", "NFD");

		expect(result).toBe("e\u0301");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should normalize a string in pipe", () => {
		const result = DCommon.pipe(
			"\u00E9",
			DString.normalize("NFD"),
		);

		expect(result).toBe("e\u0301");
	});
});
