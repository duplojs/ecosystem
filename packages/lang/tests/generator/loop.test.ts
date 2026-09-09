import { DArray, DGenerator, type ExpectType } from "@scripts";

describe("loop", () => {
	it("yields next values and final exit value", () => {
		const result = DGenerator.loop<number, number>((params) => {
			if (params.previousOutput === 3) {
				return params.exit(4);
			}

			return params.next(
				params.previousOutput === undefined
					? 1
					: params.previousOutput + 1,
			);
		});

		expect(DArray.from(result)).toStrictEqual([1, 2, 3, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<number, unknown, unknown>,
			"strict"
		>;
	});

	it("skips undefined next and exit values", () => {
		const result = DGenerator.loop<undefined, number>((params) => {
			if (params.count === 5) {
				return params.exit();
			}

			return params.count % 2 === 0
				? params.next(params.count)
				: params.next();
		});

		expect(DArray.from(result)).toStrictEqual([0, 2, 4]);
	});
});
