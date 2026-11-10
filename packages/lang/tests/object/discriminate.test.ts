import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";
import * as DObject from "@scripts/object";

describe("discriminate", () => {
	it.each([
		{
			value: "Duplo",
			expected: true,
		},
		{
			value: 42,
			expected: false,
		},
	])("should test the property $value with a predicate", ({ value, expected }) => {
		const predicate = vi.fn((input: string | number): boolean => DCommon.isType(input, "string"));

		const result = DObject.discriminate({ value }, "value", predicate);

		expect(result).toBe(expected);
		expect(predicate).toHaveBeenCalledExactlyOnceWith(value);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
	});

	it("should intersect an object with its narrowed property", () => {
		interface Source {
			readonly value: string | number;
			readonly id: 1;
		}
		const source = {
			value: "Duplo",
			id: 1,
		} as Source;

		if (DObject.discriminate(source, "value", DCommon.isType("string"))) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				Source & { value: string },
				"strict"
			>;

			expect(source.value).toBe("Duplo");
			expect(source.id).toBe(1);
		} else {
			expect.fail("the string property should match");
		}
	});

	it("should narrow discriminated unions with an equality predicate", () => {
		type Source =
			| {
				type: "created";
				id: 1;
			}
			| {
				type: "deleted";
				id: 2;
			};
		const source = {
			type: "created",
			id: 1,
		} as Source;

		if (DObject.discriminate(source, "type", DCommon.equal("created"))) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				{
					type: "created";
					id: 1;
				},
				"strict"
			>;
			type _CheckId = DCommon.ExpectType<typeof source.id, 1, "strict">;

			expect(source.id).toBe(1);
		} else {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				{
					type: "deleted";
					id: 2;
				},
				"strict"
			>;
			expect.fail("the created event should match");
		}
	});

	it("should preserve the narrowed property in pipe", () => {
		interface Source {
			value: string | number;
			id: number;
		}
		const source = {
			value: "Duplo",
			id: 1,
		} as Source;

		const result = DCommon.pipe(
			source,
			DCommon.when(
				DObject.discriminate("value", DCommon.isType("string")),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						Source & { value: string },
						"strict"
					>;

					return value.value;
				},
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string | Source, "strict">;
		expect(result).toBe("Duplo");
	});

	it("should keep the input type for a boolean predicate in pipe", () => {
		interface Source {
			value: string | number;
			id: number;
		}
		const source = {
			value: 42,
			id: 1,
		} as Source;
		const predicate = vi.fn((value: string | number): boolean => DCommon.isType(value, "string"));

		const result = DCommon.pipe(
			source,
			DCommon.when(
				DObject.discriminate("value", predicate),
				(value) => {
					type _CheckValue = DCommon.ExpectType<typeof value, Source, "strict">;

					return value.id;
				},
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, number | Source, "strict">;
		expect(result).toBe(source);
		expect(predicate).toHaveBeenCalledExactlyOnceWith(42);
	});

	it("should add a constraint to a numeric property in pipe", () => {
		interface Source {
			age: number;
			name: string;
		}
		const source = {
			age: 20,
			name: "Duplo",
		} as Source;

		const result = DCommon.pipe(
			source,
			DCommon.when(
				DObject.discriminate("age", DNumber.greaterThan(18)),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						Source & { age: number & DNumber.GreaterThan<18> },
						"strict"
					>;

					return value.age;
				},
			),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(number & DNumber.GreaterThan<18>) | Source,
			"strict"
		>;
		expect(result).toBe(20);
	});

	it("should compose predicates for nested objects", () => {
		interface Source {
			profile: { role: string };
			enabled: boolean;
		}
		const source = {
			profile: { role: "admin" },
			enabled: true,
		} as Source;

		if (DObject.discriminate(source, "profile", DObject.discriminate("role", DCommon.equal("admin")))) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				Source & { profile: { role: string } & { role: "admin" } },
				"strict"
			>;

			expect(source.profile.role).toBe("admin");
		} else {
			expect.fail("the nested role should match");
		}
	});

	it("should pass undefined for an absent optional property", () => {
		const source: { value?: string } = {};
		const predicate = vi.fn((value: string | undefined): boolean => DCommon.isType(value, "undefined"));

		expect(DObject.discriminate(source, "value", predicate)).toBe(true);
		expect(predicate).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it("should narrow an optional property when it is defined", () => {
		interface Source {
			value?: string;
		}
		const source = { value: "Duplo" } as Source;

		if (DObject.discriminate(source, "value", DCommon.isType("string"))) {
			type _CheckSource = DCommon.ExpectType<typeof source, Source & { value: string }, "strict">;

			expect(source.value).toBe("Duplo");
		} else {
			expect.fail("the defined string property should match");
		}
	});

	it("should accept numeric and symbol keys", () => {
		const key = Symbol("value");

		expect(DObject.discriminate({ 0: "Duplo" }, 0, DCommon.equal("Duplo"))).toBe(true);
		expect(DObject.discriminate({ [key]: "Duplo" }, key, DCommon.equal("Duplo"))).toBe(true);
	});

	it("should require a known key and a compatible predicate input", () => {
		// @ts-expect-error the key must belong to the input
		DObject.discriminate({ value: 1 }, "missing", (): boolean => false);
		// @ts-expect-error the predicate must accept the property type
		DObject.discriminate({ value: 1 }, "value", (value: string): boolean => DCommon.equal(value, "Duplo"));
	});
});
