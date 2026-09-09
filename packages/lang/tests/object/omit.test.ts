import { DObject, pipe, type ExpectType } from "@scripts";

describe("omit", () => {
	it("should omit keys from an array", () => {
		const source = {
			name: "Duplo",
			version: 1,
			enabled: true,
		} as const;

		const result = DObject.omit(source, ["version"] as const);
		expect(result).toEqual({
			name: "Duplo",
			enabled: true,
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				readonly name: "Duplo";
				readonly enabled: true;
			},
			"strict"
		>;
	});

	it("should omit keys from an object matcher", () => {
		const result = DObject.omit(
			{
				name: "Duplo",
				version: 1,
				enabled: true,
			},
			{
				version: true,
				enabled: false,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
			enabled: true,
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				name: string;
				enabled: boolean;
			},
			"strict"
		>;
	});

	it("should omit keys in pipe", () => {
		const result = pipe(
			{
				name: "Duplo",
				version: 1,
			} as const,
			DObject.omit(["version"] as const),
		);

		expect(result).toEqual({
			name: "Duplo",
		});
	});
});
