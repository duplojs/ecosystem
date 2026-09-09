import { DArray, pipe, when, type ExpectType } from "@scripts";

describe("lengthEqual", () => {
	it("should validate an array with the expected length", () => {
		expect(DArray.lengthEqual(["a", "b", "c"], 3)).toBe(true);
		expect(DArray.lengthEqual(["a", "b"], 3)).toBe(false);
	});

	it("should narrow the array inside a pipe when callback", () => {
		const source = ["a", "b", "c"] as string[];
		const result = pipe(
			source,
			when(
				DArray.lengthEqual(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string[] & DArray.LengthEqual<3>,
						"strict"
					>;

					return value.length;
				},
			),
		);

		expect(result).toBe(3);
	});

	it("should narrow the array with a length equal constraint", () => {
		const source = ["a", "b", "c"] as string[];

		if (DArray.lengthEqual(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				string[] & DArray.LengthEqual<3>,
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
		const source = [1, 2, 3] as
			| (string[] & DArray.LengthEqual<3>)
			| (number[] & DArray.LengthEqual<5>)
			| (boolean[] & DArray.MinElements<2>)
			| (symbol[] & DArray.MaxElements<5>)
			| (bigint[] & DArray.MinElements<5>)
			| (Date[] & DArray.MaxElements<2>);

		if (DArray.lengthEqual(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (string[] & DArray.LengthEqual<3>)
				| (boolean[] & DArray.MinElements<2> & DArray.LengthEqual<3>)
				| (symbol[] & DArray.MaxElements<5> & DArray.LengthEqual<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (number[] & DArray.LengthEqual<5>)
				| (boolean[] & DArray.MinElements<2>)
				| (symbol[] & DArray.MaxElements<5>)
				| (bigint[] & DArray.MinElements<5>)
				| (Date[] & DArray.MaxElements<2>),
				"strict"
			>;
		}
	});

	it("should reject incompatible length equal constraints", () => {
		const sourceLength = ["a", "b", "c", "d"] as string[] & DArray.LengthEqual<4>;
		const sourceMin = ["a", "b", "c", "d"] as string[] & DArray.MinElements<4>;
		const sourceMax = ["a", "b"] as string[] & DArray.MaxElements<2>;
		const length = 3 as number;

		expect(DArray.lengthEqual(["a", "b", "c"], length)).toBe(true);

		// @ts-expect-error Cannot apply LengthEqual<3> on LengthEqual<4>.
		expect(DArray.lengthEqual(sourceLength, 3)).toBe(false);

		// @ts-expect-error Cannot apply LengthEqual<3> on MinElements<4>.
		expect(DArray.lengthEqual(sourceMin, 3)).toBe(false);

		// @ts-expect-error Cannot apply LengthEqual<3> on MaxElements<2>.
		expect(DArray.lengthEqual(sourceMax, 3)).toBe(false);
	});
});
