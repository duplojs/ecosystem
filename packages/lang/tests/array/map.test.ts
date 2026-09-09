import { DArray, pipe, type ExpectType } from "@scripts";

describe("map", () => {
	it("should map values with callback params", () => {
		const source = ["a" as const, "bb" as const, "ccc" as const];
		const result = DArray.map(
			source,
			(element, params) => {
				expect(params.self).toBe(source);
				return `${params.index}:${element.length}` as const;
			},
		);

		expect(result).toEqual(["0:1", "1:2", "2:3"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly `${number}:${number}`[],
			"strict"
		>;
	});

	it("should map values in pipe and preserve size constraints", () => {
		const source = [1, 2, 3] as
			& number[]
			& DArray.LengthEqual<3>
			& DArray.MinElements<3>
			& DArray.MaxElements<3>;
		const result = pipe(
			source,
			DArray.map((value) => `${value}`),
		);

		expect(result).toEqual(["1", "2", "3"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly string[] & DArray.LengthEqual<3> & DArray.MinElements<3> & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should distribute constrained array unions before mapping", () => {
		const source = [1, 2, 3] as
			| (number[] & DArray.LengthEqual<0>)
			| (number[] & DArray.LengthEqual<3>);
		const result = DArray.map(source, (value) => `${value}`);

		expect(result).toEqual(["1", "2", "3"]);

		type _CheckResult = ExpectType<
			typeof result,
			| (readonly string[] & DArray.LengthEqual<0>)
			| (readonly string[] & DArray.LengthEqual<3>),
			"strict"
		>;
	});
});
