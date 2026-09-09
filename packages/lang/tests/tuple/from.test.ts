import { DTuple, type DArray, type ExpectType } from "@scripts";

describe("from", () => {
	it("should return the source array", () => {
		const source = ["a", "b", "c"];
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual(["a", "b", "c"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[],
			"strict"
		>;
	});

	it("should create a tuple from an array with length equal constraint", () => {
		const source = [1, 2, 3] as number[] & DArray.LengthEqual<3>;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly [number, number, number],
			"strict"
		>;
	});

	it("should create a tuple from an array with min elements constraint", () => {
		const source = ["a", "b"] as string[] & DArray.MinElements<2>;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly [string, string, ...string[]],
			"strict"
		>;
	});

	it("should preserve an array with max elements constraint", () => {
		const source = ["a", "b"] as string[] & DArray.MaxElements<2>;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[] & DArray.MaxElements<2>,
			"strict"
		>;
	});

	it("should create a tuple from an array with length equal and matching max elements constraints", () => {
		const source = [1, 2, 3] as number[] & DArray.LengthEqual<3> & DArray.MaxElements<3>;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly [number, number, number] & DArray.MaxElements<3>,
			"strict"
		>;
	});

	it("should create a tuple from an array with length equal and wider max elements constraints", () => {
		const source = [1, 2, 3] as number[] & DArray.LengthEqual<3> & DArray.MaxElements<5>;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly [number, number, number] & DArray.MaxElements<3> & DArray.MaxElements<5>,
			"strict"
		>;
	});

	it("should create a tuple with spread from an array with min and max elements constraints", () => {
		const source = ["a", "b", "c"] as string[] & DArray.MinElements<2> & DArray.MaxElements<5>;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual(["a", "b", "c"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly [string, string, ...string[]] & DArray.MaxElements<5>,
			"strict"
		>;
	});

	it("should create a tuple with spread from an array with equal min and max elements constraints", () => {
		const source = ["a", "b"] as string[] & DArray.MinElements<2> & DArray.MaxElements<2>;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly [string, string, ...string[]] & DArray.MaxElements<2>,
			"strict"
		>;
	});

	it("should create a tuple from a readonly tuple", () => {
		const source = ["a", "b"] as const;
		const result = DTuple.from(source);

		expect(result).toBe(source);
		expect(result).toEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			readonly ["a" | "b", "a" | "b"],
			"strict"
		>;
	});
});
