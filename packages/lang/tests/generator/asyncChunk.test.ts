import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";
import * as DGenerator from "@scripts/generator";

describe("asyncChunk", () => {
	it("splits async iterable values into chunks", async() => {
		const input = (async function *() {
			yield await Promise.resolve(1 as const);
			yield await Promise.resolve(2 as const);
			yield await Promise.resolve(3 as const);
			yield await Promise.resolve(4 as const);
			yield await Promise.resolve(5 as const);
		})();
		const result = DGenerator.asyncChunk(input, 2);

		await expect(DArray.from(result)).resolves.toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<
				& readonly (1 | 2 | 3 | 4 | 5)[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>,
				unknown,
				unknown
			>,
			"strict"
		>;
	});

	it("splits async values in pipe", async() => {
		const result = DCommon.pipe(
			(async function *() {
				yield await Promise.resolve("a" as const);
				yield await Promise.resolve("b" as const);
				yield await Promise.resolve("c" as const);
				yield await Promise.resolve("d" as const);
			})(),
			DGenerator.asyncChunk(2),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([["a", "b"], ["c", "d"]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<
				& readonly ("a" | "b" | "c" | "d")[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>,
				unknown,
				unknown
			>,
			"strict"
		>;
	});

	it("preserves item unions inside generated async chunks", async() => {
		const input = (async function *() {
			yield await Promise.resolve(1 as 1 | "a");
			yield await Promise.resolve("a" as 1 | "a");
		})();
		const result = DGenerator.asyncChunk(input, 2);

		await expect(DArray.from(result)).resolves.toStrictEqual([[1, "a"]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<
				& readonly ("a" | 1)[]
				& DArray.MinElements<1>
				& DArray.MaxElements<2>,
				unknown,
				unknown
			>,
			"strict"
		>;
	});

	it.each([
		{
			size: 0.5,
			expected: [[1], [2], [3], [4], [5]],
		},
		{
			size: 2.4,
			expected: [[1, 2], [3, 4], [5]],
		},
		{
			size: 2.5,
			expected: [[1, 2, 3], [4, 5]],
		},
	] as const)("rounds fractional size $size without applying a maximum length constraint", async({ size, expected }) => {
		const input = (async function *() {
			yield *await Promise.resolve([1, 2, 3, 4, 5]);
		})();
		const result = DGenerator.asyncChunk(input, size);

		await expect(DArray.from(result)).resolves.toStrictEqual(expected);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("rounds a fractional size in pipe without applying a maximum length constraint", async() => {
		const result = DCommon.pipe(
			(async function *() {
				yield *await Promise.resolve([1, 2, 3, 4, 5]);
			})(),
			DGenerator.asyncChunk(1.6),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([[1, 2], [3, 4], [5]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("does not apply a maximum length constraint for a negative integer literal", async() => {
		const input = (async function *() {
			yield *await Promise.resolve([1, 2]);
		})();
		const result = DGenerator.asyncChunk(input, -1);

		await expect(DArray.from(result)).resolves.toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("does not apply a maximum length constraint for a negative integer literal in pipe", async() => {
		const result = DCommon.pipe(
			(async function *() {
				yield *await Promise.resolve([1, 2]);
			})(),
			DGenerator.asyncChunk(-2),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it("does not apply a maximum length constraint for a non-literal size", async() => {
		const input = (async function *() {
			yield *await Promise.resolve([1, 2, 3]);
		})();
		const result = DGenerator.asyncChunk(input, 2 as number);

		await expect(DArray.from(result)).resolves.toStrictEqual([[1, 2], [3]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly number[] & DArray.MinElements<1>, unknown, unknown>,
			"strict"
		>;
	});

	it.each([0, 0.1, NaN])("returns no chunks when size %s does not round to a positive number", async(size) => {
		const input = (async function *() {
			yield *await Promise.resolve([1, 2]);
		})();
		const result = DGenerator.asyncChunk(input, size);

		await expect(DArray.from(result)).resolves.toStrictEqual([]);
	});

	it("returns no chunks for an empty async iterable", async() => {
		const input = (async function *() {
			yield *await Promise.resolve([] as number[]);
		})();
		const result = DGenerator.asyncChunk(input, 2);

		await expect(DArray.from(result)).resolves.toStrictEqual([]);
	});
});
