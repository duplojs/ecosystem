
import * as DCommon from "@scripts/common";

describe("falsy", () => {
	it("detects falsy and truthy values", () => {
		expect(DCommon.falsy("")).toBe(true);
		expect(DCommon.falsy(0)).toBe(true);
		expect(DCommon.falsy(0n)).toBe(true);
		expect(DCommon.falsy(undefined)).toBe(true);
		expect(DCommon.falsy("value")).toBe(false);
	});

	it("narrows to falsy values", () => {
		const normalize = (input: "" | "value") => {
			if (DCommon.falsy(input)) {
				type _CheckInput = DCommon.ExpectType<
					typeof input,
					"",
					"strict"
				>;

				return "empty";
			} else {
				type _CheckInput = DCommon.ExpectType<
					typeof input,
					"value",
					"strict"
				>;

				return input.toUpperCase();
			}
		};

		expect(normalize("")).toBe("empty");
		expect(normalize("value")).toBe("VALUE");
	});
});
