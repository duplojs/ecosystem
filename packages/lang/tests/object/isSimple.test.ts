import { DObject, type ExpectType } from "@scripts";

describe("isSimple", () => {
	it("should accept plain objects", () => {
		expect(DObject.isSimple({})).toBe(true);
		expect(DObject.isSimple({ name: "Duplo" })).toBe(true);
		expect(DObject.isSimple(Object.create(null))).toBe(true);
	});

	it("should reject non simple objects and non objects", () => {
		class User {
			public readonly name = "Jane";
		}

		expect(DObject.isSimple(null)).toBe(false);
		expect(DObject.isSimple(undefined)).toBe(false);
		expect(DObject.isSimple("value")).toBe(false);
		expect(DObject.isSimple(42)).toBe(false);
		expect(DObject.isSimple(true)).toBe(false);
		expect(DObject.isSimple([])).toBe(false);
		expect(DObject.isSimple(new Date())).toBe(false);
		expect(DObject.isSimple(new User())).toBe(false);
	});

	it("should narrow input to object", () => {
		const input: unknown = { name: "Duplo" };

		if (DObject.isSimple(input)) {
			type _CheckInput = ExpectType<
				typeof input,
				object,
				"strict"
			>;
		}
	});
});
