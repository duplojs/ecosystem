import { DObject, pipe, type ExpectType } from "@scripts";

describe("override", () => {
	it("should override defined values", () => {
		const result = DObject.override(
			{
				name: "Duplo",
				version: 1,
			},
			{
				version: 2,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
			version: 2,
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				name: string;
				version: number;
			},
			"strict"
		>;
	});

	it("should ignore undefined values", () => {
		const result = DObject.override(
			{
				name: "Duplo",
				version: 1,
			},
			{
				version: undefined,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
			version: 1,
		});
	});

	it("should override values in pipe", () => {
		const source: {
			name: string;
			version: number;
		} = {
			name: "Duplo",
			version: 1,
		};
		const result = pipe(
			source,
			DObject.override({ version: 2 }),
		);

		expect(result).toEqual({
			name: "Duplo",
			version: 2,
		});
	});
});
