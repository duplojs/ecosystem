import { DObject, pipe, type ExpectType } from "@scripts";

describe("transformProperty", () => {
	it("should transform an object property", () => {
		const result = DObject.transformProperty(
			{
				name: "Duplo",
				version: 1,
			},
			"version",
			(value) => `${value}`,
		);

		expect(result).toEqual({
			name: "Duplo",
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

	it("should transform an object property in pipe", () => {
		const result = pipe(
			{
				name: "Duplo",
				version: 1,
			},
			DObject.transformProperty("version", (value) => value + 1),
		);

		expect(result).toEqual({
			name: "Duplo",
			version: 2,
		});
	});
});
