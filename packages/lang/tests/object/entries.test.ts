import { DCommon, DKind, DObject, type DString, type ExpectType } from "@scripts";

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

		type _CheckResult = ExpectType<
			typeof result,
			(["name", string] | ["version", number])[],
			"strict"
		>;
	});

	it("should list array entries", () => {
		const result = DObject.entries(["a", "b"] as const);

		expect(result).toEqual([
			["0", "a"],
			["1", "b"],
		]);

		type _CheckResult = ExpectType<
			typeof result,
			[DString.Number, "a" | "b"][],
			"strict"
		>;
	});
});
