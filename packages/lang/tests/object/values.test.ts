import { DCommon, DKind, DObject, type ExpectType } from "@scripts";

describe("values", () => {
	it("should list public object values", () => {
		const kind = DKind.create<"entity", boolean>("entity");
		const source = {
			name: "Duplo",
			version: 1,
			[kind.runTimeKey]: true,
		};

		const result = DObject.values(source);
		expect(result).toEqual(["Duplo", 1]);
	});

	it("should infer object values", () => {
		const result = DObject.values({
			name: "Duplo",
			version: 1,
		} as const);

		type _CheckResult = ExpectType<
			typeof result,
			("Duplo" | 1)[],
			"strict"
		>;
	});
});
