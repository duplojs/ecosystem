import * as DString from "@scripts/string";
import * as DCommon from "@scripts/common";

describe("isKeyof", () => {
	it("should validate a key with a defined value", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};

		const result = DString.isKeyof("name", source);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		expect(result).toBe(true);
		expect(DString.isKeyof("missing", source)).toBe(false);
	});

	it("should recognize an own key with an undefined value", () => {
		const source = {
			name: undefined,
		};

		expect(DString.isKeyof("name", source)).toBe(true);
	});

	it("should return a boolean in pipe", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};
		const key = "name" as "name" | "missing";
		const result = DCommon.pipe(
			key,
			DString.isKeyof(source),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		expect(result).toBe(true);
	});

	it("should narrow the key type in both branches", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};
		const key = "name" as "name" | "missing";

		if (DString.isKeyof(key, source)) {
			type _CheckKey = DCommon.ExpectType<
				typeof key,
				"name",
				"strict"
			>;
		} else {
			type _CheckKey = DCommon.ExpectType<
				typeof key,
				"missing",
				"strict"
			>;
		}
	});

	it.each(["toString", "constructor", "__proto__"])("should reject inherited key %s", (key) => {
		const source = { value: 42 };

		expect(DString.isKeyof(key, source)).toBe(false);
	});

	it.each(["toString", "constructor", "__proto__"])("should recognize %s when it is an own key", (key) => {
		const source = { [key]: undefined };

		expect(DString.isKeyof(key, source)).toBe(true);
	});

	it("should recognize a custom inherited method", () => {
		class Source {
			public save() {
				return "saved";
			}
		}

		const source = new Source();
		const key = "save" as "save" | "missing";

		if (DString.isKeyof(key, source)) {
			type _CheckKey = DCommon.ExpectType<typeof key, "save", "strict">;

			expect(source[key]()).toBe("saved");
		} else {
			type _CheckKey = DCommon.ExpectType<typeof key, "missing", "strict">;
		}

		const result = DString.isKeyof(key, source);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		expect(result).toBe(true);
		expect(DString.isKeyof("missing", source)).toBe(false);
	});

	it("should recognize a custom inherited method in pipe", () => {
		class Source {
			public save() {
				return "saved";
			}
		}

		const source = new Source();
		const result = DCommon.pipe(
			"save" as "save" | "missing",
			DCommon.when(
				DString.isKeyof(source),
				(key) => {
					type _CheckKey = DCommon.ExpectType<typeof key, "save", "strict">;

					return source[key]();
				},
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

		expect(result).toBe("saved");
	});

	it("should recognize an inherited override of an Object prototype method", () => {
		class Source {
			public toString() {
				return "custom";
			}
		}

		expect(DString.isKeyof("toString", new Source())).toBe(true);
	});

	it("should find an Object method override across multiple prototype levels", () => {
		class Parent {
			public toString() {
				return "custom";
			}
		}

		class Source extends Parent {}

		const source = new Source();
		const key = "toString" as "toString" | "missing";

		if (DString.isKeyof(key, source)) {
			type _CheckKey = DCommon.ExpectType<typeof key, "toString", "strict">;

			expect(source[key]()).toBe("custom");
		}

		expect(DString.isKeyof(key, source)).toBe(true);
	});

	it("should stop before Object.prototype across multiple prototype levels", () => {
		class Parent {}
		class Source extends Parent {}

		expect(DString.isKeyof("toString", new Source())).toBe(false);
	});

	it("should recognize an inherited accessor without reading its value", () => {
		const readValue = vi.fn(() => undefined);
		class Source {
			public get value() {
				return readValue();
			}
		}

		expect(DString.isKeyof("value", new Source())).toBe(true);
		expect(readValue).not.toHaveBeenCalled();
	});

	it("should recognize inherited numeric and symbol keys", () => {
		const key = Symbol("key");
		class Source {
			public 1() {
				return undefined;
			}

			public [key]() {
				return undefined;
			}
		}

		const source = new Source();

		expect(DString.isKeyof(1, source)).toBe(true);
		expect(DString.isKeyof(key, source)).toBe(true);
	});

	it("should support objects with a null prototype", () => {
		const source = {
			__proto__: null,
			value: undefined,
		};

		expect(DString.isKeyof("value", source)).toBe(true);
		expect(DString.isKeyof("missing", source)).toBe(false);
		expect(DString.isKeyof("toString", source)).toBe(false);
	});

	it.each([
		{
			key: "toString",
			expected: "toString",
		},
		{
			key: "name",
			expected: true,
		},
		{
			key: "undefinedValue",
			expected: true,
		},
	])("should check own key $key in pipe", ({ key, expected }) => {
		const source = {
			name: "Duplo",
			undefinedValue: undefined,
		};
		const result = DCommon.pipe(
			key,
			DCommon.when(
				DString.isKeyof(source),
				(value) => {
					type _CheckKey = DCommon.ExpectType<typeof value, "name" | "undefinedValue", "strict">;

					return true as const;
				},
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string | true, "strict">;

		expect(result).toBe(expected);
	});

	it("should recognize own numeric and symbol keys", () => {
		const key = Symbol("key");
		const source = {
			1: 0,
			[key]: null,
		};

		expect(DString.isKeyof(1, source)).toBe(true);
		expect(DString.isKeyof(key, source)).toBe(true);
	});

	it("should check an own key without invoking its getter", () => {
		const readValue = vi.fn(() => 42);
		const source = {
			get value() {
				return readValue();
			},
		};

		expect(DString.isKeyof("value", source)).toBe(true);
		expect(readValue).not.toHaveBeenCalled();
	});
});
