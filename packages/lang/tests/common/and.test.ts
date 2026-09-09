import { DCommon, type ExpectType, pipe, when } from "@scripts";

describe("and", () => {
	it("returns true only when every predicate accepts the input", () => {
		const predicates = [
			(input: number) => input > 0,
			(input: number) => input % 2 === 0,
		] satisfies [
			(input: number) => boolean,
			(input: number) => boolean,
		];

		expect(DCommon.and(2, predicates)).toBe(true);
		expect(DCommon.and(3, predicates)).toBe(false);
		expect(DCommon.and(-2, predicates)).toBe(false);
	});

	it("supports curried predicates in a pipe", () => {
		const result = pipe(
			2,
			when(
				DCommon.and([
					(input: number) => input > 0,
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

	it("narrows with every predicate", () => {
		const format = (input: string | number | null) => {
			if (
				DCommon.and(input, [
					(value): value is string | number => value !== null,
					(value): value is string => typeof value === "string",
				])
			) {
				type _CheckInput = ExpectType<
					typeof input,
					string,
					"strict"
				>;

				return input.toUpperCase();
			} else {
				type _CheckInput = ExpectType<
					typeof input,
					number | null,
					"strict"
				>;

				return input;
			}
		};

		expect(format("value")).toBe("VALUE");
		expect(format(42)).toBe(42);
		expect(format(null)).toBeNull();
	});
});
