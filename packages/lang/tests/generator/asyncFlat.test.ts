import * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";
import * as DGenerator from "@scripts/generator";

describe("asyncFlat", () => {
	it("flattens one level by default", async() => {
		const result = DGenerator.asyncFlat((async function *() {
			yield await Promise.resolve([1, 2] as const);
			yield await Promise.resolve([3] as const);
		})());

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("flattens sync and async nested values up to the requested depth", async() => {
		const result = DGenerator.asyncFlat((async function *() {
			yield (async function *() {
				yield (async function *() {
					yield await Promise.resolve(1 as const);
				})();
				yield await Promise.resolve([2] as const);
			})();
			yield await Promise.resolve([[3]] as const);
		})(), 2);

		await expect(DArray.from(result)).resolves.toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | 3, void, unknown>,
			"strict"
		>;
	});

	it("prefers async iteration when a nested value supports both protocols", async() => {
		const input = {
			*[Symbol.iterator]() {
				yield "sync" as const;
			},
			async *[Symbol.asyncIterator]() {
				yield await Promise.resolve(42 as const);
			},
		};
		const result = DGenerator.asyncFlat([input], 1);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([42]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<42, void, unknown>,
			"strict"
		>;
	});

	it("keeps nested values when depth is reached", async() => {
		const result = DGenerator.asyncFlat((async function *() {
			yield await Promise.resolve([[1], [2]] as const);
		})(), 1);

		await expect(DArray.from(result)).resolves.toStrictEqual([[1], [2]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly [1] | readonly [2], void, unknown>,
			"strict"
		>;
	});

	it("infers resolved promise values with a depth of zero", async() => {
		const result = DGenerator.asyncFlat([Promise.resolve(42 as const)], 0);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([42]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<42, void, unknown>,
			"strict"
		>;
	});

	it("resolves promised arrays before flattening their promised elements", async() => {
		const input = [Promise.resolve([Promise.resolve(42 as const)] as const)];
		const result = DGenerator.asyncFlat(input, 1);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([42]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<42, void, unknown>,
			"strict"
		>;
	});

	it("resolves promised arrays supplied by a custom async iterator before flattening", async() => {
		const input = {
			[Symbol.asyncIterator]() {
				const iterator = DGenerator.flat([Promise.resolve([42] as const)], 0);

				return { next: () => Promise.resolve(iterator.next()) };
			},
		};
		const result = DGenerator.asyncFlat(input, 1);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([42]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<42, void, unknown>,
			"strict"
		>;
	});

	it("preserves promises inside arrays when the depth is zero", async() => {
		const value = Promise.resolve(42 as const);
		const result = DGenerator.asyncFlat([Promise.resolve([value] as const)], 0);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([[value]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly [Promise<42>], void, unknown>,
			"strict"
		>;
	});

	it.each([
		{
			depth: -1,
			expected: [[42]],
		},
		{
			depth: 0.5,
			expected: [[42]],
		},
		{
			depth: 1.5,
			expected: [42],
		},
	] as const)("infers unknown values for a negative or fractional depth of $depth", async({ depth, expected }) => {
		const result = DGenerator.asyncFlat([[42] as const], depth);
		const values = await DArray.from(result);

		expect(values).toStrictEqual(expected);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<unknown, void, unknown>,
			"strict"
		>;
	});

	it("infers unknown values for a non-literal depth", async() => {
		const depth = 0 as number;
		const result = DGenerator.asyncFlat([[42] as const], depth);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<unknown, void, unknown>,
			"strict"
		>;
	});

	it("preserves the possible values for a union of valid literal depths", async() => {
		const depth = 0 as 0 | 1;
		const result = DGenerator.asyncFlat([[42] as const], depth);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<readonly [42] | 42, void, unknown>,
			"strict"
		>;
	});

	it("infers unknown values when a depth union includes an invalid literal", async() => {
		const depth = 0 as 0 | -1;
		const result = DGenerator.asyncFlat([[42] as const], depth);
		const values = await DArray.from(result);

		expect(values).toStrictEqual([[42]]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<unknown, void, unknown>,
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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | 2 | false | null | undefined, void, unknown>,
			"strict"
		>;
	});

	it.each([undefined, 42] as const)("preserves objects with non-callable iteration methods of %s", async(iterator) => {
		const input = {
			[Symbol.iterator]: iterator,
			[Symbol.asyncIterator]: iterator,
		};
		const result = DGenerator.asyncFlat([input]);
		const values = await DArray.from(result);

		expect(values).toHaveLength(1);
		expect(DArray.first(values)).toBe(input);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<typeof input, void, unknown>,
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

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", void, unknown>,
			"strict"
		>;
	});
});
