import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";
import * as DGenerator from "@scripts/generator";

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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | 3 | 4 | 5, unknown, unknown>,
			"strict"
		>;
	});

	it("concatenates async values in pipe", async() => {
		const tail: Iterable<number> = new Set([4, 5]);
		const result = DCommon.pipe(
			[1, 2, 3],
			DGenerator.asyncFilter((item) => item > 1),
			DGenerator.asyncConcat(tail),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([2, 3, 4, 5]);

		type _CheckResult = DCommon.ExpectType<
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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});

	it("infers distinct item types from the head and following iterables", async() => {
		const result = DGenerator.asyncConcat([1, 2] as const, ["a"] as const, new Set(["b"] as const));

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, "a", "b"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | "a" | "b", unknown, unknown>,
			"strict"
		>;
	});

	it("infers distinct item types in a pipe", async() => {
		const result = DCommon.pipe(
			[1, 2] as const,
			DGenerator.asyncConcat(["a", "b"] as const),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, "a", "b"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | "a" | "b", unknown, unknown>,
			"strict"
		>;
	});

	it("infers distinct types when an async iterable follows a sync iterable", async() => {
		const tail = (async function *() {
			yield await Promise.resolve("a" as const);
		})();
		const result = DGenerator.asyncConcat([1] as const, tail);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, "a"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});

	it("infers distinct types from an async input in a pipe", async() => {
		const head = (async function *() {
			yield await Promise.resolve(1 as const);
		})();
		const result = DCommon.pipe(
			head,
			DGenerator.asyncConcat(["a"] as const),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, "a"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});
});
