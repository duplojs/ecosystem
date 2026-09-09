import { DString, type DArray, type ExpectType, pipe } from "@scripts";

describe("sort", () => {
	it("should sort strings in ascending order without mutating the source", () => {
		const source = ["b", "a", "c"] as
			& string[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<3>
			& DArray.MaxElements<3>;
		const result = DString.sort(source, "ASC");

		expect(result).toEqual(["a", "b", "c"]);
		expect(source).toEqual(["b", "a", "c"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should sort strings in descending order", () => {
		expect(DString.sort(["a", "b", "a"], "DSC")).toEqual(["b", "a", "a"]);
	});

	it("should sort strings in pipe", () => {
		const result = pipe(
			["b", "a", "c"] as const,
			DString.sort("ASC"),
		);

		expect(result).toEqual(["a", "b", "c"]);
	});
});
