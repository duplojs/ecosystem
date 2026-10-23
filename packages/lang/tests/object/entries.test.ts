
import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

describe("entries", () => {
	it("should list public object entries", () => {
		const kind = DKind.create<"entity", boolean>("entity");
		const source = kind.addTo(
			{
				name: "Duplo",
				version: 1,
			},
			true,
		);

		const result = DObject.entries(source);
		expect(result).toEqual([
			["name", "Duplo"],
			["version", 1],
		]);
	});

	it("should infer object entries", () => {
		const result = DObject.entries({
			name: "Duplo",
			version: 1,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly (readonly ["name", string] | readonly ["version", number])[],
			"strict"
		>;
	});

	it("should list array entries", () => {
		const result = DObject.entries(["a", "b"] as const);

		expect(result).toEqual([
			["0", "a"],
			["1", "b"],
		]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly(readonly [DString.Number, "a" | "b"])[],
			"strict"
		>;
	});
});
