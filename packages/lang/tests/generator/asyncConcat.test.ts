import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("asyncConcat", () => {
	it("concatenates sync and async iterables", async() => {
		const result = DGenerator.asyncConcat(
			(async function *() {
				yield await Promise.resolve(1 as const);
				yield await Promise.resolve(2 as const);
			})(),
			[3],
			(async function *() {
				yield await Promise.resolve(4 as const);
				yield await Promise.resolve(5 as const);
			})(),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3, 4, 5]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | 3 | 4 | 5, unknown, unknown>,
			"strict"
		>;
	});

	it("concatenates async values in pipe", async() => {
		const tail: Iterable<number> = new Set([4, 5]);
		const result = pipe(
			[1, 2, 3],
			DGenerator.asyncFilter((item) => item > 1),
			DGenerator.asyncConcat(tail),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([2, 3, 4, 5]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<number, unknown, unknown>,
			"strict"
		>;
	});

	it("preserves item unions across concatenated async iterables", async() => {
		const head = (async function *() {
			yield await Promise.resolve(1 as 1 | "a");
		})();
		const tail = ["a"] as (1 | "a")[];
		const result = DGenerator.asyncConcat(head, tail);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});
});
