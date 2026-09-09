import { DCommon, type ExpectType } from "@scripts";

describe("simpleClone", () => {
	it("returns primitive and falsy values directly", () => {
		expect(DCommon.simpleClone(null)).toBeNull();
		expect(DCommon.simpleClone(undefined)).toBeUndefined();
		expect(DCommon.simpleClone(0)).toBe(0);
		expect(DCommon.simpleClone("value")).toBe("value");
	});

	it("deep clones plain objects and arrays", () => {
		const input = {
			name: "Jane",
			nested: {
				values: [1, 2, 3],
			},
		};
		const result = DCommon.simpleClone(input);

		type _CheckResult = ExpectType<
			typeof result,
			typeof input,
			"strict"
		>;

		expect(result).toStrictEqual(input);
		expect(result).not.toBe(input);
		expect(result.nested).not.toBe(input.nested);
		expect(result.nested.values).not.toBe(input.nested.values);
	});

	it("preserves accessors on plain objects", () => {
		const input = {
			get value() {
				return "computed";
			},
		};
		const result = DCommon.simpleClone(input);

		expect(result).not.toBe(input);
		expect(Object.getOwnPropertyDescriptor(result, "value")?.get).toBe(
			Object.getOwnPropertyDescriptor(input, "value")?.get,
		);
		expect(result.value).toBe("computed");
	});

	it("returns class instances directly", () => {
		class User {
			public constructor(
				public name: string,
			) {}
		}

		const input = new User("Jane");

		expect(DCommon.simpleClone(input)).toBe(input);
	});
});
