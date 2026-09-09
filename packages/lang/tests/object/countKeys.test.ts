import { DKind, DObject, type ExpectType } from "@scripts";

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
		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});
});
