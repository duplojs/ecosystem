import { DString, type ExpectType } from "@scripts";

describe("isNotEmpty", () => {
	it("should validate a non-empty string", () => {
		expect(DString.isNotEmpty(" ")).toBe(true);
		expect(DString.isNotEmpty("")).toBe(false);
	});

	it("should narrow the string with a not empty constraint", () => {
		const source = "hello" as string;

		if (DString.isNotEmpty(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.NotEmpty,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});
});
