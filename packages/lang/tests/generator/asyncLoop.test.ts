import { DArray, DGenerator, type ExpectType } from "@scripts";

type AsyncLoopUntilDoneOutput = Promise<
	| DGenerator.LoopOutputNextResult<number>
	| DGenerator.LoopOutputExistResult<string>
>;

type AsyncLoopSkipOutput = Promise<
	| DGenerator.LoopOutputNextResult<number | undefined>
	| DGenerator.LoopOutputExistResult<undefined>
>;

describe("asyncLoop", () => {
	it("yields next values and final exit value", async() => {
		const result = DGenerator.asyncLoop<number, AsyncLoopUntilDoneOutput>(
			(params) => Promise.resolve(
				params.previousOutput === 3
					? params.exit("done")
					: params.next(
						params.previousOutput === undefined
							? 1
							: params.previousOutput + 1,
					),
			),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3, "done"]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<number | string, unknown, unknown>,
			"strict"
		>;
	});

	it("skips undefined next and exit values", async() => {
		const result = DGenerator.asyncLoop<number, AsyncLoopSkipOutput>(
			(params) => {
				if (params.count === 5) {
					return Promise.resolve(params.exit());
				}

				if (params.count % 2 === 0) {
					return Promise.resolve(params.next(params.count));
				}

				return Promise.resolve(params.next());
			},
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([0, 2, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<number, unknown, unknown>,
			"strict"
		>;
	});
});
