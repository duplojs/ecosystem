import { DCommon, type ExpectType, pipe } from "@scripts";

describe("mimeType", () => {
	it("maps known extensions to their MIME type", () => {
		expect(DCommon.mimeType.get("json")).toBe("application/json");
		expect(DCommon.mimeType.get("JSON")).toBe("application/json");
		expect(DCommon.mimeType.get("svg")).toBe("image/svg+xml");
		expect(DCommon.mimeType.get("txt")).toBe("text/plain");
	});

	it("returns undefined for unknown extensions", () => {
		expect(DCommon.mimeType.get("missing")).toBeUndefined();
		expect(DCommon.mimeType.get(".json")).toBeUndefined();
	});

	it("sets custom MIME types case-insensitively", () => {
		DCommon.mimeType.set("CUSTOM", "Text/Custom");

		expect(DCommon.mimeType.get("custom")).toBe("text/custom");
	});

	it("can be used in a pipe", () => {
		const result = pipe(
			"json",
			(extension) => DCommon.mimeType.get(extension),
		);

		type _CheckResult = ExpectType<
			typeof result,
			string | undefined,
			"strict"
		>;

		expect(result).toBe("application/json");
	});
});
