import { DString, type ExpectType } from "@scripts";

describe("isUuid", () => {
	it("should validate an uuid", () => {
		expect(DString.isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
		expect(DString.isUuid("550e8400-e29b-91d4-a716-446655440000")).toBe(false);
	});

	it("should validate nil and max uuid values", () => {
		expect(DString.isUuid("00000000-0000-0000-0000-000000000000")).toBe(true);
		expect(DString.isUuid("ffffffff-ffff-ffff-ffff-ffffffffffff")).toBe(true);
	});

	it("should narrow the string with an uuid constraint", () => {
		const source = "550e8400-e29b-41d4-a716-446655440000" as string;

		if (DString.isUuid(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.Uuid,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});
});
