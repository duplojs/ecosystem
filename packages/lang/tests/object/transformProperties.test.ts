import { DObject, pipe, type ExpectType } from "@scripts";

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

	it("should transform object properties in pipe", () => {
		const result = pipe(
			{
				name: "Duplo",
				version: 1,
			},
			DObject.transformProperties({
				version: (value) => value + 1,
			}),
		);

		expect(result).toEqual({
			name: "Duplo",
			version: 2,
		});
	});
});
