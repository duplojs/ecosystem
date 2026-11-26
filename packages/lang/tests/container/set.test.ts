import type * as DCommon from "@scripts/common";
import * as DContainer from "@scripts/container";

describe("createSet", () => {
	it("creates an empty set with unknown or explicit types", () => {
		const set = DContainer.createSet();
		const typed = DContainer.createSet<number>();

		type _CheckSet = DCommon.ExpectType<typeof set, DContainer.Set<unknown>, "strict">;
		type _CheckTyped = DCommon.ExpectType<typeof typed, DContainer.Set<number>, "strict">;

		expect(set.size).toBe(0);
		expect([...set]).toStrictEqual([]);
		expect(typed.has(1)).toBe(false);
		expect(typed.delete(1)).toBe(false);
	});

	it("infers values from readonly input and removes duplicates in insertion order", () => {
		const set = DContainer.createSet([1, 2, 1] as const);
		const iterator = set[Symbol.iterator]();

		type _CheckSet = DCommon.ExpectType<typeof set, DContainer.Set<1 | 2>, "strict">;
		type _CheckIterator = DCommon.ExpectType<typeof iterator, ReturnType<Iterable<1 | 2, unknown>[typeof Symbol.iterator]>, "strict">;

		expect(set.size).toBe(2);
		expect([...set]).toStrictEqual([1, 2]);
	});

	it("consumes a non-array iterable once", () => {
		const iterate = vi.fn(function *() {
			yield 1;
			yield 2;
			yield 1;
		});
		const set = DContainer.createSet({ [Symbol.iterator]: iterate });

		expect(iterate).toHaveBeenCalledOnce();
		expect([...set]).toStrictEqual([1, 2]);
		expect(set.size).toBe(2);
	});

	it("adds values without returning the mutable container or moving duplicates", () => {
		const set = DContainer.createSet([1, 2]);
		const result = set.add(1);

		type _CheckResult = DCommon.ExpectType<typeof result, void, "strict">;

		expect(result).toBeUndefined();
		expect(set.size).toBe(2);
		set.add(3);
		expect(set.has(3)).toBe(true);
		expect(set.size).toBe(3);
		expect([...set]).toStrictEqual([1, 2, 3]);
	});

	it("reports deletion and appends a reinserted value at the end", () => {
		const set = DContainer.createSet([1, 2]);
		const result = set.delete(1);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		expect(result).toBe(true);
		expect(set.delete(1)).toBe(false);
		expect(set.has(1)).toBe(false);
		expect(set.size).toBe(1);
		set.add(1);
		expect([...set]).toStrictEqual([2, 1]);
		expect(set.delete(2)).toBe(true);
		expect(set.delete(1)).toBe(true);
		expect(set.size).toBe(0);
		expect([...set]).toStrictEqual([]);
	});

	it("preserves undefined, null and falsy values as entries", () => {
		const set = DContainer.createSet<undefined | null | number | boolean | string>([
			undefined,
			null,
			0,
			false,
			"",
		]);

		expect(set.has(undefined)).toBe(true);
		expect(set.has(null)).toBe(true);
		expect(set.size).toBe(5);
		expect([...set]).toStrictEqual([
			undefined,
			null,
			0,
			false,
			"",
		]);
		expect(set.delete(undefined)).toBe(true);
		expect(set.has(undefined)).toBe(false);
	});

	it("uses native equality and preserves object references", () => {
		const value = { id: 1 };
		const otherValue = { id: 1 };
		const set = DContainer.createSet<object | number>([
			value,
			value,
			otherValue,
			NaN,
			NaN,
			-0,
			0,
		]);

		expect(set.has(value)).toBe(true);
		expect(set.has({ id: 1 })).toBe(false);
		expect(set.has(NaN)).toBe(true);
		expect(set.has(0)).toBe(true);
		expect(set.size).toBe(4);
		expect([...set]).toStrictEqual([value, otherValue, NaN, 0]);
		expect(set[Symbol.iterator]().next().value).toBe(value);
	});

	it("copies the source collection and keeps instances independent", () => {
		const source = new Set([1]);
		const set = DContainer.createSet(source);
		const copy = DContainer.createSet(set);
		source.add(2);
		set.add(3);
		copy.delete(1);

		expect([...source]).toStrictEqual([1, 2]);
		expect([...set]).toStrictEqual([1, 3]);
		expect([...copy]).toStrictEqual([]);
	});

	it("provides independent live iterators in insertion order", () => {
		const set = DContainer.createSet([1, 2]);
		const first = set[Symbol.iterator]();
		const second = set[Symbol.iterator]();

		expect(first.next()).toStrictEqual({
			value: 1,
			done: false,
		});
		expect(second.next()).toStrictEqual({
			value: 1,
			done: false,
		});
		set.delete(2);
		set.add(3);
		expect(first.next()).toStrictEqual({
			value: 3,
			done: false,
		});
		expect(first.next().done).toBe(true);
		expect(second.next()).toStrictEqual({
			value: 3,
			done: false,
		});
		expect(second.next().done).toBe(true);
	});

	it("limits the public API and offers a readonly view of the current state", () => {
		const set = DContainer.createSet<number>();
		const readonlySet: DContainer.ReadonlySet<number> = set;

		type _CheckSize = DCommon.ExpectType<Pick<typeof set, "size">, { readonly size: number }, "strict">;
		type _CheckAdd = DCommon.ExpectType<typeof set.add, (value: number) => void, "strict">;
		type _CheckReadonly = DCommon.ExpectType<Extract<keyof typeof readonlySet, "add" | "delete">, never, "strict">;
		type _CheckLimited = DCommon.ExpectType<Extract<keyof typeof set, "clear" | "forEach" | "entries" | "keys" | "values">, never, "strict">;

		// @ts-expect-error widening a mutable set would permit incompatible writes
		const widened: DContainer.Set<number | string> = set;

		expect(widened).toBe(set);
		expect(set).not.toBeInstanceOf(Set);
		expect(set).not.toHaveProperty("clear");
		expect(set).not.toHaveProperty("forEach");
		set.add(1);
		expect(readonlySet.has(1)).toBe(true);
		expect(readonlySet.size).toBe(1);
		expect([...readonlySet]).toStrictEqual([1]);
	});

	it("carries the set kind without matching native sets or other containers", () => {
		const set = DContainer.createSet();

		expect(DContainer.setKind.has(set)).toBe(true);
		expect(DContainer.setKind.getValue(set)).toBeNull();
		expect(DContainer.setKind.has(new Set())).toBe(false);
		expect(DContainer.setKind.has(DContainer.createMap())).toBe(false);
		expect(DContainer.mapKind.has(set)).toBe(false);
	});
});
