import { DArray, pipe, when, type ExpectType } from "@scripts";

describe("maxElements", () => {
	it("should validate an array shorter than the maximum", () => {
		expect(DArray.maxElements(["a", "b", "c"], 3)).toBe(true);
		expect(DArray.maxElements(["a", "b", "c", "d"], 3)).toBe(false);
	});

	it("should narrow the array inside a pipe when callback", () => {
		const source = ["a", "b", "c"] as string[];
		const result = pipe(
			source,
			when(
				DArray.maxElements(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string[] & DArray.MaxElements<3>,
						"strict"
					>;

					return value.length;
				},
			),
		);

		expect(result).toBe(3);
	});

	it("should narrow the array with a max elements constraint", () => {
		const source = ["a", "b", "c"] as string[];

		if (DArray.maxElements(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				string[] & DArray.MaxElements<3>,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string[],
				"strict"
			>;
		}
	});

	it("should discriminate compatible size constraints", () => {
		const source = [1, 2] as
			| (string[] & DArray.MaxElements<2>)
			| (number[] & DArray.MaxElements<5>)
			| (boolean[] & DArray.LengthEqual<4>)
			| (symbol[] & DArray.MinElements<2>)
			| (bigint[] & DArray.MinElements<5>);

		if (DArray.maxElements(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (string[] & DArray.MaxElements<2>)
				| (number[] & DArray.MaxElements<5> & DArray.MaxElements<3>)
				| (symbol[] & DArray.MinElements<2> & DArray.MaxElements<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (number[] & DArray.MaxElements<5>)
				| (boolean[] & DArray.LengthEqual<4>)
				| (symbol[] & DArray.MinElements<2>)
				| (bigint[] & DArray.MinElements<5>),
				"strict"
			>;
		}
	});

	it("should reject incompatible max elements constraints", () => {
		const sourceMin = ["a", "b", "c", "d"] as string[] & DArray.MinElements<4>;
		const sourceLength = ["a", "b", "c", "d"] as string[] & DArray.LengthEqual<4>;
		const max = 3 as number;

		expect(DArray.maxElements(["a", "b", "c"], max)).toBe(true);

		// @ts-expect-error Cannot apply MaxElements<3> on MinElements<4>.
		expect(DArray.maxElements(sourceMin, 3)).toBe(false);

		// @ts-expect-error Cannot apply MaxElements<3> on LengthEqual<4>.
		expect(DArray.maxElements(sourceLength, 3)).toBe(false);
	});
});
