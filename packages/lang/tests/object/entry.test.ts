import { DObject, type ExpectType } from "@scripts";

describe("entry", () => {
	it("should create a readonly object entry", () => {
		const result = DObject.entry("name", "Duplo" as const);

		expect(result).toEqual(["name", "Duplo"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly ["name", "Duplo"],
			"strict"
		>;
	});
});
