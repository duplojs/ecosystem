
import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import * as DObject from "@scripts/object";

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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly ("Duplo" | 1)[],
			"strict"
		>;
	});
});
