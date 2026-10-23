import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import * as DObject from "@scripts/object";

describe("countKeys", () => {
	it("should count public object keys", () => {
		const kind = DKind.create<"entity", boolean>("entity");
		const source = kind.addTo(
			{
				name: "Duplo",
				version: 1,
			},
			true,
		);

		expect(DObject.countKeys(source)).toBe(2);

		const result = DObject.countKeys(source);
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
