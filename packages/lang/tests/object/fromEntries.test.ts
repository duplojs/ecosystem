import { DObject, type ExpectType } from "@scripts";

describe("fromEntries", () => {
	it("should create an object from entries", () => {
		const result = DObject.fromEntries([
			["name", "Duplo"],
			["version", 1],
		] as const);

		expect(result).toEqual({
			name: "Duplo",
			version: 1,
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				name?: "Duplo";
				version?: 1;
			},
			"strict"
		>;
	});

	it("should infer required keys from broad entries", () => {
		const entries = [["name", "Duplo"]] as [string, string][];
		const result = DObject.fromEntries(entries);

		expect(result).toEqual({
			name: "Duplo",
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				[key: string]: string;
			},
			"strict"
		>;
	});
});
