import type * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";

describe("isSimple", () => {
	it("should accept plain objects", () => {
		expect(DObject.isSimple({})).toBe(true);
		expect(DObject.isSimple({ name: "Duplo" })).toBe(true);
		expect(DObject.isSimple(Object.create(null))).toBe(true);
	});

	it("should reject non simple objects", () => {
		class User {
			public readonly name = "Jane";
		}

		expect(DObject.isSimple([])).toBe(false);
		expect(DObject.isSimple(new Date())).toBe(false);
		expect(DObject.isSimple(new User())).toBe(false);
		expect(DObject.isSimple({ constructor: null })).toBe(false);
	});

	it("should require an object and return a boolean", () => {
		const input: unknown = { name: "Duplo" };
		// @ts-expect-error An unknown value must be checked before calling isSimple.
		const result = DObject.isSimple(input);

		expect(result).toBe(true);

		type _CheckParameters = DCommon.ExpectType<
			Parameters<typeof DObject.isSimple>,
			[input: object],
			"strict"
		>;
		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
	});

	it.each([
		{
			input: { name: "Duplo" },
			expected: true,
		},
		{
			input: new Date(),
			expected: false,
		},
	])("should preserve the input type when returning $expected", ({ input, expected }) => {
		const result = DObject.isSimple(input);

		expect(result).toBe(expected);

		if (DObject.isSimple(input)) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				{ name: string } | Date,
				"strict"
			>;
		} else {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				{ name: string } | Date,
				"strict"
			>;
		}
	});
});
