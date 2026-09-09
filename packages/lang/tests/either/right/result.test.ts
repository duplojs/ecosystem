import { DEither, pipe, type ExpectType } from "@scripts";

describe("result", () => {
	it("should create a result right either", () => {
		const either = DEither.result("created", 42);

		expect(DEither.isRight(either)).toBe(true);
		expect(DEither.resultKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("created");
		expect(DEither.valueKind.getValue(either)).toBe(42);

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Result<"created", 42>,
			"strict"
		>;
	});

	it("should create a result right either in pipe", () => {
		const result = pipe(
			42,
			DEither.result("created"),
		);

		expect(result).toStrictEqual(DEither.result("created", 42));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Result<"created", 42>,
			"strict"
		>;
	});
});
