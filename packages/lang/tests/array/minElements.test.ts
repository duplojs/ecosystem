import { DArray, pipe, when, type ExpectType } from "@scripts";

describe("minElements", () => {
	it("should validate an array longer than the minimum", () => {
		expect(DArray.minElements(["a", "b", "c"], 3)).toBe(true);
		expect(DArray.minElements(["a", "b"], 3)).toBe(false);
	});

	it("should narrow the array inside a pipe when callback", () => {
		const source = ["a", "b", "c"] as string[];
		const result = pipe(
			source,
			when(
				DArray.minElements(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string[] & DArray.MinElements<3>,
						"strict"
					>;

					return value.length;
				},
			),
		);

		expect(result).toBe(3);
	});

	it("should narrow the array with a min elements constraint", () => {
		const source = ["a", "b", "c"] as string[];

		if (DArray.minElements(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				string[] & DArray.MinElements<3>,
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
			| (string[] & DArray.MinElements<2>)
			| (number[] & DArray.MinElements<5>)
			| (boolean[] & DArray.LengthEqual<4>)
			| (symbol[] & DArray.MaxElements<2>)
			| (bigint[] & DArray.MaxElements<5>);

		if (DArray.minElements(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (number[] & DArray.MinElements<5>)
				| (string[] & DArray.MinElements<2> & DArray.MinElements<3>)
				| (boolean[] & DArray.LengthEqual<4>)
				| (bigint[] & DArray.MaxElements<5> & DArray.MinElements<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (string[] & DArray.MinElements<2>)
				| (symbol[] & DArray.MaxElements<2>)
				| (bigint[] & DArray.MaxElements<5>),
				"strict"
			>;
		}
	});

	it("should reject incompatible min elements constraints", () => {
		const sourceMax = ["a", "b"] as string[] & DArray.MaxElements<2>;
		const sourceLength = ["a", "b"] as string[] & DArray.LengthEqual<2>;
		const min = 3 as number;

		expect(DArray.minElements(["a", "b", "c"], min)).toBe(true);

		// @ts-expect-error Cannot apply MinElements<3> on MaxElements<2>.
		expect(DArray.minElements(sourceMax, 3)).toBe(false);

		// @ts-expect-error Cannot apply MinElements<3> on LengthEqual<2>.
		expect(DArray.minElements(sourceLength, 3)).toBe(false);
	});
});
