import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("asyncMap", () => {
	it("maps async iterable values", async() => {
		const input = (async function *() {
			yield await Promise.resolve("a" as const);
			yield await Promise.resolve("bb" as const);
		})();
		const result = DGenerator.asyncMap(
			input,
			async(item, params) => String(`${params.index}:${await Promise.resolve(item.length)}`),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual(["0:1", "1:2"]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<string, unknown, unknown>,
			"strict"
		>;
	});

	it("maps sync values in pipe", async() => {
		const result = pipe(
			[1, 2, 3],
			DGenerator.asyncMap(async(item) => Promise.resolve(item * 3)),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([3, 6, 9]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<number, unknown, unknown>,
			"strict"
		>;
	});

	it("preserves item unions from async iterable input", async() => {
		const input = (async function *() {
			yield await Promise.resolve(1 as 1 | "a");
			yield await Promise.resolve("a" as 1 | "a");
		})();
		const result = DGenerator.asyncMap(input, async(item) => {
			type _CheckItem = ExpectType<
				typeof item,
				1 | "a",
				"strict"
			>;

			return Promise.resolve(item);
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});
});
