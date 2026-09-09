import { DArray, DCommon, type ExpectType, pipe } from "@scripts";

describe("equal", () => {
	it("compares values directly", () => {
		expect(DCommon.equal("value", "value")).toBe(true);
		expect(DCommon.equal("other" as string, "value")).toBe(false);
	});

	it("compares against a value list", () => {
		const normalize = (input: "value" | "other" | null) => {
			if (DCommon.equal(input, ["value", null])) {
				type _CheckInput = ExpectType<
					typeof input,
					"value" | null,
					"strict"
				>;

				return input ?? "empty";
			} else {
				type _CheckInput = ExpectType<
					typeof input,
					"other",
					"strict"
				>;

				return input.toUpperCase();
			}
		};

		expect(normalize("value")).toBe("value");
		expect(normalize(null)).toBe("empty");
		expect(normalize("other")).toBe("OTHER");
	});

	it("supports curried usage in a pipe", () => {
		const result = pipe(
			["value", "other"] as const,
			DArray.filter(DCommon.equal("value")),
			DArray.first,
		);

		type _CheckResult = ExpectType<
			typeof result,
			"value" | undefined,
			"strict"
		>;

		expect(result).toBe("value");
	});
});
