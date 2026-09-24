import { DArray, DObject, pipe, type ExpectType } from "@scripts";

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

		type _CheckResult = ExpectType<
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

		const result = pipe(
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

		type check = ExpectType<
			typeof result,
			{
				prop1: string;
				prop3: readonly [1, 2] | (readonly (1 | 2)[] & DArray.MaxElements<2>);
				prop2: string;
			},
			"strict"
		>;
	});
});
