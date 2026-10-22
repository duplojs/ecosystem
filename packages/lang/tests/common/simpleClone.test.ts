import * as DCommon from "@scripts/common";

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

		type _CheckResult = DCommon.ExpectType<
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

	it("preserves symbol properties as guaranteed by its return type", () => {
		const key = Symbol("value");
		const input = {
			name: "Duplo",
			[key]: 42,
		};

		const result = DCommon.simpleClone(input);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			typeof input,
			"strict"
		>;

		expect(result).toStrictEqual(input);
	});

	it("deep clones values stored in symbol properties", () => {
		const key = Symbol("value");
		const input = { [key]: { values: [1, 2] } };
		const result = DCommon.simpleClone(input);

		expect(result).toStrictEqual(input);
		expect(result[key]).not.toBe(input[key]);
		expect(result[key].values).not.toBe(input[key].values);

		type _CheckResult = DCommon.ExpectType<typeof result, typeof input, "strict">;
	});

	it("preserves symbol accessors without invoking them", () => {
		const key = Symbol("value");
		const getter = vi.fn(() => 42);
		const setter = vi.fn();
		const input = Object.defineProperty({}, key, {
			enumerable: true,
			get: getter,
			set: setter,
		});

		const result = DCommon.simpleClone(input);

		expect(Object.getOwnPropertyDescriptor(result, key)).toStrictEqual(
			Object.getOwnPropertyDescriptor(input, key),
		);
		expect(getter).not.toHaveBeenCalled();
		expect(setter).not.toHaveBeenCalled();
	});

	it("ignores non-enumerable symbol properties", () => {
		const key = Symbol("value");
		const input = Object.defineProperty({ name: "Duplo" }, key, {
			enumerable: false,
			value: 42,
		});

		const result = DCommon.simpleClone(input);

		expect(result).toStrictEqual({ name: "Duplo" });
		expect(Object.getOwnPropertySymbols(result)).toStrictEqual([]);
	});

	it("preserves enumerable inherited string properties when cloning symbol properties", () => {
		const key = Symbol("value");
		const input = Object.create({ name: "Duplo" }) as {
			name: string;
			[key]: number;
		};
		input[key] = 42;

		const result = DCommon.simpleClone(input);

		expect(result).toStrictEqual({
			name: "Duplo",
			[key]: 42,
		});
	});

	it("clones enumerable symbol properties from objects without a prototype", () => {
		const key = Symbol("value");
		const input = Object.create(null) as { [key]: number };
		input[key] = 42;

		const result = DCommon.simpleClone(input);

		expect(result).toStrictEqual({ [key]: 42 });
	});

	it("returns array subclasses directly", () => {
		class Values extends Array<number> {}
		const input = new Values(1, 2);

		const result = DCommon.simpleClone(input);

		expect(result).toBe(input);
	});
});
