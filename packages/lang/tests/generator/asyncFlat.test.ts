import { DArray, DGenerator, type ExpectType } from "@scripts";

describe("asyncFlat", () => {
	it("flattens one level by default", async() => {
		const result = DGenerator.asyncFlat((async function *() {
			yield await Promise.resolve([1, 2] as const);
			yield await Promise.resolve([3] as const);
		})());

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("flattens sync and async nested values up to the requested depth", async() => {
		const result = DGenerator.asyncFlat((async function *() {
			yield (async function *() {
				yield await Promise.resolve([1] as const);
				yield await Promise.resolve([2] as const);
			})();
			yield await Promise.resolve([[3]] as const);
		})(), 2);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("keeps nested values when depth is reached", async() => {
		const result = DGenerator.asyncFlat((async function *() {
			yield await Promise.resolve([[1], [2]] as const);
		})(), 1);

		await expect(DArray.from(result)).resolves.toStrictEqual([[1], [2]]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<readonly [1] | readonly [2], void, unknown>,
			"strict"
		>;
	});

	it("does not flatten non iterable values", async() => {
		const result = DGenerator.asyncFlat((async function *() {
			yield await Promise.resolve([1] as const);
			yield await Promise.resolve(2 as const);
			yield await Promise.resolve(false as const);
			yield await Promise.resolve(null);
			yield await Promise.resolve(undefined);
		})());

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, false, null, undefined]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | false | null | undefined, void, unknown>,
			"strict"
		>;
	});

	it("preserves unions from nested and plain async iterable values", async() => {
		const input = (async function *() {
			yield await Promise.resolve([1] as const);
			yield await Promise.resolve("a" as const);
		})();
		const result = DGenerator.asyncFlat(input);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", void, unknown>,
			"strict"
		>;
	});
});
