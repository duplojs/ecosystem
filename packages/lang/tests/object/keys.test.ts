import { DCommon, DKind, DObject, type ExpectType } from "@scripts";

describe("keys", () => {
	it("should list public object keys", () => {
		const kind = DKind.create<"entity", boolean>("entity");
		const source = kind.addTo(
			{
				name: "Duplo",
				version: 1,
			},
			true,
		);

		const result = DObject.keys(source);
		expect(result).toEqual(["name", "version"]);
	});

	it("should infer object keys", () => {
		const result = DObject.keys({
			name: "Duplo",
			version: 1,
		});

		type _CheckResult = ExpectType<
			typeof result,
			("name" | "version")[],
			"strict"
		>;
	});
});
