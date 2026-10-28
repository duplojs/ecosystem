import type * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";

describe("entry", () => {
	it("should create a readonly object entry", () => {
		const result = DObject.entry("name", "Duplo" as const);

		expect(result).toEqual(["name", "Duplo"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly ["name", "Duplo"],
			"strict"
		>;
	});
});
