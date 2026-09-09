import { DString, type ExpectType } from "@scripts";

describe("isUrl", () => {
	it("should validate an url", () => {
		expect(DString.isUrl("https://duplojs.dev/lang")).toBe(true);
		expect(DString.isUrl("duplojs.dev/lang")).toBe(false);
	});

	it("should narrow the string with an url constraint", () => {
		const source = "https://duplojs.dev" as string;

		if (DString.isUrl(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.Url,
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
