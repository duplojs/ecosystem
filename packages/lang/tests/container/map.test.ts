import type * as DCommon from "@scripts/common";
import * as DContainer from "@scripts/container";

describe("createMap", () => {
	it("creates an empty map with unknown or explicit types", () => {
		const map = DContainer.createMap();
		const typed = DContainer.createMap<string, number>();

		type _CheckMap = DCommon.ExpectType<typeof map, DContainer.Map<unknown, unknown>, "strict">;
		type _CheckTyped = DCommon.ExpectType<typeof typed, DContainer.Map<string, number>, "strict">;

		expect(map.size).toBe(0);
		expect([...map]).toStrictEqual([]);
		expect(typed.get("missing")).toBeUndefined();
		expect(typed.has("missing")).toBe(false);
		expect(typed.delete("missing")).toBe(false);
	});

	it("infers key and value types from readonly entries", () => {
		const map = DContainer.createMap([["first", 1], ["second", 2]] as const);
		const value = map.get("first");
		const iterator = map[Symbol.iterator]();

		type _CheckMap = DCommon.ExpectType<typeof map, DContainer.Map<"first" | "second", 1 | 2>, "strict">;
		type _CheckValue = DCommon.ExpectType<typeof value, 1 | 2 | undefined, "strict">;
		type _CheckIterator = DCommon.ExpectType<typeof iterator, ReturnType<Iterable<readonly ["first" | "second", 1 | 2], unknown>[typeof Symbol.iterator]>, "strict">;

		expect(value).toBe(1);
		expect(map.size).toBe(2);
		expect([...map]).toStrictEqual([["first", 1], ["second", 2]]);
	});

	it("consumes an iterable once and replaces duplicate keys in their initial position", () => {
		const iterate = vi.fn(function *() {
			yield ["first", 1] as const;
			yield ["second", 2] as const;
			yield ["first", 3] as const;
		});
		const map = DContainer.createMap({ [Symbol.iterator]: iterate });

		expect(iterate).toHaveBeenCalledOnce();
		expect(map.size).toBe(2);
		expect([...map]).toStrictEqual([["first", 3], ["second", 2]]);
	});

	it("adds and replaces entries without returning the mutable container", () => {
		const map = DContainer.createMap<string, number>([["first", 1], ["second", 2]]);
		const result = map.set("first", 3);

		type _CheckResult = DCommon.ExpectType<typeof result, void, "strict">;

		expect(result).toBeUndefined();
		expect(map.get("first")).toBe(3);
		expect(map.has("first")).toBe(true);
		expect(map.size).toBe(2);
		map.set("third", 4);
		expect(map.size).toBe(3);
		expect([...map]).toStrictEqual([["first", 3], ["second", 2], ["third", 4]]);
	});

	it("reports deletion and appends a reinserted key at the end", () => {
		const map = DContainer.createMap([["first", 1], ["second", 2]]);
		const result = map.delete("first");

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		expect(result).toBe(true);
		expect(map.delete("first")).toBe(false);
		expect(map.has("first")).toBe(false);
		expect(map.get("first")).toBeUndefined();
		expect(map.size).toBe(1);
		map.set("first", 3);
		expect([...map]).toStrictEqual([["second", 2], ["first", 3]]);
		expect(map.delete("second")).toBe(true);
		expect(map.delete("first")).toBe(true);
		expect(map.size).toBe(0);
		expect([...map]).toStrictEqual([]);
	});

	it("distinguishes missing keys from entries containing undefined", () => {
		const map = DContainer.createMap<string | undefined, number | undefined>();
		map.set(undefined, undefined);

		expect(map.get(undefined)).toBeUndefined();
		expect(map.has(undefined)).toBe(true);
		expect(map.has("missing")).toBe(false);
		expect(map.size).toBe(1);
		expect(map.delete(undefined)).toBe(true);
		expect(map.has(undefined)).toBe(false);
	});

	it("uses native key equality and preserves object references", () => {
		const key = { id: 1 };
		const value = { count: 1 };
		const map = DContainer.createMap<object | number, object>();
		map.set(key, value);
		map.set(NaN, value);
		map.set(NaN, value);
		map.set(-0, value);
		map.set(0, value);

		expect(map.get(key)).toBe(value);
		expect(map.has({ id: 1 })).toBe(false);
		expect(map.get(NaN)).toBe(value);
		expect(map.get(0)).toBe(value);
		expect(map.size).toBe(3);
	});

	it("copies the source collection and keeps instances independent", () => {
		const source = new Map([["first", 1]]);
		const map = DContainer.createMap(source);
		const copy = DContainer.createMap(map);
		source.set("external", 2);
		map.set("internal", 3);
		copy.delete("first");

		expect([...source]).toStrictEqual([["first", 1], ["external", 2]]);
		expect([...map]).toStrictEqual([["first", 1], ["internal", 3]]);
		expect([...copy]).toStrictEqual([]);
	});

	it("provides independent live iterators in insertion order", () => {
		const map = DContainer.createMap([["first", 1], ["second", 2]]);
		const first = map[Symbol.iterator]();
		const second = map[Symbol.iterator]();

		expect(first.next()).toStrictEqual({
			value: ["first", 1],
			done: false,
		});
		expect(second.next()).toStrictEqual({
			value: ["first", 1],
			done: false,
		});
		map.delete("second");
		map.set("third", 3);
		expect(first.next()).toStrictEqual({
			value: ["third", 3],
			done: false,
		});
		expect(first.next().done).toBe(true);
		expect(second.next()).toStrictEqual({
			value: ["third", 3],
			done: false,
		});
		expect(second.next().done).toBe(true);
	});

	it("limits the public API and offers a readonly view of the current state", () => {
		const map = DContainer.createMap<string, number>();
		const readonlyMap: DContainer.ReadonlyMap<string, number | boolean> = map;

		type _CheckSize = DCommon.ExpectType<Pick<typeof map, "size">, { readonly size: number }, "strict">;
		type _CheckSet = DCommon.ExpectType<typeof map.set, (key: string, value: number) => void, "strict">;
		type _CheckReadonly = DCommon.ExpectType<Extract<keyof typeof readonlyMap, "set" | "delete">, never, "strict">;
		type _CheckLimited = DCommon.ExpectType<Extract<keyof typeof map, "clear" | "forEach" | "entries" | "keys" | "values">, never, "strict">;

		// @ts-expect-error widening mutable values would permit incompatible writes
		const widenedValue: DContainer.Map<string, number | boolean> = map;
		// @ts-expect-error widening mutable keys would permit incompatible writes
		const widenedKey: DContainer.Map<string | number, number> = map;

		expect(widenedValue).toBe(map);
		expect(widenedKey).toBe(map);
		expect(map).not.toBeInstanceOf(Map);
		expect(map).not.toHaveProperty("clear");
		expect(map).not.toHaveProperty("forEach");
		map.set("first", 1);
		expect(readonlyMap.get("first")).toBe(1);
		expect(readonlyMap.size).toBe(1);
	});

	it("carries the map kind without matching native maps or other containers", () => {
		const map = DContainer.createMap();

		expect(DContainer.mapKind.has(map)).toBe(true);
		expect(DContainer.mapKind.getValue(map)).toBeNull();
		expect(DContainer.mapKind.has(new Map())).toBe(false);
		expect(DContainer.mapKind.has(DContainer.createSet())).toBe(false);
		expect(DContainer.setKind.has(map)).toBe(false);
	});
});
