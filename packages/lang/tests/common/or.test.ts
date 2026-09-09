import { DCommon, type ExpectType, pipe, when } from "@scripts";

describe("or", () => {
	it("returns true when at least one predicate accepts the input", () => {
		const predicates = [
			(input: number) => input < 0,
			(input: number) => input % 2 === 0,
		] satisfies [
			(input: number) => boolean,
			(input: number) => boolean,
		];

		expect(DCommon.or(2, predicates)).toBe(true);
		expect(DCommon.or(-3, predicates)).toBe(true);
		expect(DCommon.or(3, predicates)).toBe(false);
	});

	it("supports curried predicates in a pipe", () => {
		const result = pipe(
			2,
			when(
				DCommon.or([
					(input: number) => input < 0,
					(input: number) => input % 2 === 0,
				]),
				(input) => input + 1,
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(3);
	});

	it("narrows to one accepted predicate output", () => {
		const input = "value" as string | number | null;
		const result = DCommon.or(input, [
			(value): value is string => typeof value === "string",
			(value): value is number => typeof value === "number",
		]);

		if (result) {
			type _CheckInput = ExpectType<
				typeof input,
				string | number,
				"strict"
			>;

			expect(input).toBe("value");
		} else {
			type _CheckInput = ExpectType<
				typeof input,
				null,
				"strict"
			>;
		}
	});
});
