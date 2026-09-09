import { DEither, type ExpectType } from "@scripts";

describe("rightPipe", () => {
	it("should pipe right values and wrap the final plain output into success", () => {
		const result = DEither.rightPipe(
			DEither.right("start", 20),
			(value) => {
				expect(value).toBe(20);
				return 21;
			},
			(value) => {
				expect(value).toBe(21);
				return 42;
			},
		);

		expect(result).toStrictEqual(DEither.success(42));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<42>,
			"strict"
		>;
	});

	it("should pass plain inputs through the pipe", () => {
		const result = DEither.rightPipe(
			20,
			(value) => {
				expect(value).toBe(20);
				return 21;
			},
		);

		expect(result).toStrictEqual(DEither.success(21));
	});

	it("should preserve right outputs and unwrap them for the next pipe", () => {
		const result = DEither.rightPipe(
			DEither.success(20),
			(value) => {
				expect(value).toBe(20);
				return DEither.right("middle", 21);
			},
			(value) => {
				expect(value).toBe(21);
				return 42;
			},
		);

		expect(result).toStrictEqual(DEither.success(42));
	});

	it("should keep the final right output unchanged", () => {
		const output = DEither.right("final", 42);
		const result = DEither.rightPipe(
			DEither.success(20),
			(value) => {
				expect(value).toBe(20);
				return output;
			},
		);

		expect(result).toBe(output);
	});

	it("should stop on initial or produced left values", () => {
		const initial = DEither.error("initial");
		const produced = DEither.error("produced");
		const spy = vi.fn((value: number) => value);

		const first = DEither.rightPipe(
			initial,
			spy,
		);
		const second = DEither.rightPipe(
			DEither.success(42),
			() => produced,
			spy,
		);

		expect(first).toBe(initial);
		expect(second).toBe(produced);
		expect(spy).not.toHaveBeenCalled();

		type _CheckSecond = ExpectType<
			typeof second,
			DEither.Error<"produced"> | DEither.Success<number>,
			"strict"
		>;
	});
});
