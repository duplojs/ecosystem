import { type DNumber, DString, pipe, type ExpectType } from "@scripts";

describe("padEnd", () => {
	it("should pad the end of a string", () => {
		const result = DString.padEnd("42", 5, "0");

		expect(result).toBe("42000");

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.MinCharacters<2>,
			"strict"
		>;
	});

	it("should pad the end of a string in pipe", () => {
		const result = pipe(
			"42",
			DString.padEnd(4, "0"),
		);

		expect(result).toBe("4200");
	});

	it("should keep strings that already reach the target length", () => {
		expect(DString.padEnd("hello", 3, "0")).toBe("hello");
	});

	it("should distribute constrained string unions before padding the end", () => {
		const source = "hello" as
			| (string & DString.LengthEqual<0>)
			| (string & DString.LengthEqual<5>);
		const result = DString.padEnd(source, 8, "0");

		expect(result).toBe("hello000");

		type _CheckResult = ExpectType<
			typeof result,
			| (string & DString.MinCharacters<0>)
			| (string & DString.MinCharacters<5>),
			"strict"
		>;
	});

	it("should require a positive integer target length", () => {
		const targetLength = 1 as number & DNumber.StrictPositive;

		// @ts-expect-error target length requires both positive and integer guarantees.
		DString.padEnd("42", targetLength, "0");
	});

	it("should preserve only compatible size constraints", () => {
		const sourceMin = "hello" as string & DString.MinCharacters<3>;
		const resultMin = DString.padEnd(sourceMin, 8, "0");

		type _CheckMinResult = ExpectType<
			typeof resultMin,
			string & DString.MinCharacters<3>,
			"strict"
		>;

		const sourceMax = "hello" as string & DString.MaxCharacters<5>;
		const resultMax = DString.padEnd(sourceMax, 8, "0");

		type _CheckMaxResult = ExpectType<
			typeof resultMax,
			string,
			"strict"
		>;

		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const resultLength = DString.padEnd(sourceLength, 8, "0");

		type _CheckLengthResult = ExpectType<
			typeof resultLength,
			string & DString.MinCharacters<5>,
			"strict"
		>;
	});
});
