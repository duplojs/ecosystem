import * as DArray from "@scripts/array";
import * as DObject from "@scripts/object";
import * as DCommon from "@scripts/common";

describe("transformProperties", () => {
	it("should transform object properties", () => {
		const result = DObject.transformProperties(
			{
				name: "Duplo",
				version: 1,
			},
			{
				name: (value) => value.toUpperCase(),
				version: (value) => `${value}`,
			},
		);

		expect(result).toEqual({
			name: "DUPLO",
			version: "1",
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				name: string;
				version: string;
			},
			"strict"
		>;
	});

	it("should keep a property when its transformer is undefined", () => {
		const result = DObject.transformProperties(
			{
				name: "Duplo",
				version: 1,
			},
			{
				name: undefined,
				version: (value) => value + 1,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
			version: 2,
		});
	});

	it("use in pipe", () => {
		const input = {
			prop1: 1,
			prop2: "test",
			prop3: [1, 2] as const,
		};

		const result = DCommon.pipe(
			input,
			DObject.transformProperties({
				prop1: () => "wow",
				prop3: true ? DArray.shift : undefined,
			}),
		);

		expect(result).toStrictEqual({
			prop1: "wow",
			prop2: "test",
			prop3: [2],
		});

		type check = DCommon.ExpectType<
			typeof result,
			{
				prop1: string;
				prop3: readonly [1, 2] | (readonly (1 | 2)[] & DArray.MaxElements<2>);
				prop2: string;
			},
			"strict"
		>;
	});

	it("should transform a symbol property as guaranteed by its return type", () => {
		const key = Symbol("value");
		const input = {
			name: "Duplo",
			[key]: 42,
		};

		const result = DObject.transformProperties(input, {
			[key]: (value) => `${value}`,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				name: string;
				[key]: string;
			},
			"strict"
		>;

		expect(result).toStrictEqual({
			name: "Duplo",
			[key]: "42",
		});
	});

	it("should transform symbol properties in pipe and retain an undefined transformer", () => {
		const transformed = Symbol("value");
		const retained = Symbol("value");
		const input = {
			[transformed]: 42,
			[retained]: 24,
		};
		const transformer = vi.fn((value: number) => `${value}`);
		const result = DCommon.pipe(
			input,
			DObject.transformProperties({
				[transformed]: transformer,
				[retained]: undefined,
			}),
		);

		expect(result).toStrictEqual({
			[transformed]: "42",
			[retained]: 24,
		});
		expect(transformer).toHaveBeenCalledExactlyOnceWith(42);
		expect(input).toStrictEqual({
			[transformed]: 42,
			[retained]: 24,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				[transformed]: string;
				[retained]: number;
			},
			"strict"
		>;
	});
});
