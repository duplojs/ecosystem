import * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

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

		type _CheckResult = DCommon.ExpectType<
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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				[key: string]: string;
			},
			"strict"
		>;
	});

	it("keeps broad constrained string keys required", () => {
		const key: string & DString.NotEmpty = DCommon.infer("name");
		const entries: [typeof key, string][] = [[key, "Duplo"]];
		const result = DObject.fromEntries(entries);

		expect(result).toStrictEqual({ name: "Duplo" });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ [key: string & DString.NotEmpty]: string },
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<typeof result[typeof key], string, "strict">;
	});

	it("keeps broad constrained number keys required", () => {
		const key: number & DNumber.Positive = DCommon.infer(1);
		const entries: [typeof key, string][] = [[key, "Duplo"]];
		const result = DObject.fromEntries(entries);

		expect(result).toStrictEqual({ 1: "Duplo" });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ [key: number & DNumber.Positive]: string },
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<typeof result[typeof key], string, "strict">;
	});

	it("keeps constrained literal keys optional", () => {
		const key: "name" & DString.NotEmpty = DCommon.infer("name");
		const result = DObject.fromEntries([[key, "Duplo"]] as const);

		expect(result).toStrictEqual({ name: "Duplo" });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ [key in "name" & DString.NotEmpty]?: "Duplo" },
			"strict"
		>;
	});
});
