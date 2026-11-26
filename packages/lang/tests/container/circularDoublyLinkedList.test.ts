import * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";
import * as DContainer from "@scripts/container";

describe("createCircularDoublyLinkedList", () => {
	describe("creation", () => {
		it("creates an empty list without an iterable", () => {
			const list = DContainer.createCircularDoublyLinkedList();

			type _CheckList = DCommon.ExpectType<typeof list, DContainer.CircularDoublyLinkedList<unknown>, "strict">;

			expect([...list]).toStrictEqual([]);
			expect(list.length).toBe(0);
			expect(list.firstNode).toBeUndefined();
		});

		it.each([
			{ values: [] },
			{ values: [1] },
			{ values: [1, 2] },
			{ values: [1, 2, 3, 4] },
			{ values: [1, 1, 1] },
		])("creates a circular list from $values", ({ values }) => {
			const list = DContainer.createCircularDoublyLinkedList(values);

			type _CheckList = DCommon.ExpectType<typeof list, DContainer.CircularDoublyLinkedList<number>, "strict">;

			expect([...list]).toStrictEqual(values);
			expect(list.length).toBe(values.length);
		});

		it("does not mutate the source array when the list changes", () => {
			const values = [1, 2, 3];
			const list = DContainer.createCircularDoublyLinkedList(values);

			list.add(4);
			list.prepend(0);
			list.pop();

			expect(values).toStrictEqual([1, 2, 3]);
			expect([...list]).toStrictEqual([0, 1, 2, 3]);
			expect(list.length).toBe(4);
		});

		it("consumes a non-array iterable once and preserves reference identity", () => {
			const first = { id: 1 };
			const last = { id: 2 };
			const iterate = vi.fn(function *() {
				yield first;
				yield last;
			});
			const list = DContainer.createCircularDoublyLinkedList({ [Symbol.iterator]: iterate });

			expect(iterate).toHaveBeenCalledOnce();
			expect([...list]).toStrictEqual([first, last]);
			expect(list.length).toBe(2);
			expect(list.first()).toBe(first);
			expect(list.last()).toBe(last);
		});

		it("distinguishes the list and node kinds", () => {
			const list = DContainer.createCircularDoublyLinkedList([1]);
			const node = list.firstNode!;

			expect(DContainer.circularDoublyLinkedListKind.has(list)).toBe(true);
			expect(DContainer.circularDoublyLinkedListKind.getValue(list)).toBeNull();
			expect(DContainer.circularDoublyLinkedListNodeKind.has(node)).toBe(true);
			expect(DContainer.circularDoublyLinkedListNodeKind.getValue(node)).toBeNull();
			expect(DContainer.circularDoublyLinkedListKind.has(node)).toBe(false);
			expect(DContainer.circularDoublyLinkedListNodeKind.has(list)).toBe(false);
			expect(DContainer.cellKind.has(list)).toBe(false);
		});

		it("links all nodes in both directions and closes the cycle", () => {
			const list = DContainer.createCircularDoublyLinkedList([1, 2, 3]);
			const first = list.firstNode!;
			const second = first.next;
			const third = second.next;

			expect(second.value).toBe(2);
			expect(third.value).toBe(3);
			expect(second.previous).toBe(first);
			expect(third.previous).toBe(second);
			expect(first.previous).toBe(third);
			expect(third.next).toBe(first);
		});
	});

	describe("add", () => {
		it("adds the first value with both links pointing to itself", () => {
			const list = DContainer.createCircularDoublyLinkedList<number>();
			const result = list.add(1);

			type _CheckResult = DCommon.ExpectType<typeof result, void, "strict">;

			expect(result).toBeUndefined();
			expect([...list]).toStrictEqual([1]);
			expect(list.length).toBe(1);
			expect(list.firstNode!.next).toBe(list.firstNode);
			expect(list.firstNode!.previous).toBe(list.firstNode);
		});

		it("appends values without replacing existing nodes", () => {
			const list = DContainer.createCircularDoublyLinkedList([1]);
			const firstNode = list.firstNode;

			list.add(2);
			expect([...list]).toStrictEqual([1, 2]);
			expect(list.length).toBe(2);
			const secondNode = firstNode!.next;
			list.add(3);

			expect([...list]).toStrictEqual([1, 2, 3]);
			expect(list.length).toBe(3);
			expect(list.firstNode).toBe(firstNode);
			expect(firstNode!.next).toBe(secondNode);
			expect(secondNode.previous).toBe(firstNode);
			expect(firstNode!.previous.next).toBe(firstNode);
			expect(secondNode.next.previous).toBe(secondNode);
		});

		it("preserves duplicates, undefined and null as actual entries", () => {
			const list = DContainer.createCircularDoublyLinkedList<number | null | undefined>();

			list.add(undefined);
			list.add(null);
			list.add(1);
			list.add(1);

			expect([...list]).toStrictEqual([undefined, null, 1, 1]);
			expect(list.length).toBe(4);
		});

		it("keeps lists independent", () => {
			const first = DContainer.createCircularDoublyLinkedList([1]);
			const second = DContainer.createCircularDoublyLinkedList([1]);

			first.add(2);

			expect([...first]).toStrictEqual([1, 2]);
			expect(first.length).toBe(2);
			expect([...second]).toStrictEqual([1]);
			expect(second.length).toBe(1);
			expect(first.firstNode).not.toBe(second.firstNode);
		});
	});

	describe("prepend", () => {
		it("prepends to an empty list", () => {
			const list = DContainer.createCircularDoublyLinkedList<number>();
			const result = list.prepend(1);

			type _CheckResult = DCommon.ExpectType<typeof result, void, "strict">;

			expect(result).toBeUndefined();
			expect([...list]).toStrictEqual([1]);
			expect(list.length).toBe(1);
		});

		it("moves the first node while preserving existing nodes and the last node", () => {
			const list = DContainer.createCircularDoublyLinkedList([2]);
			const oldFirstNode = list.firstNode;

			list.prepend(1);
			expect([...list]).toStrictEqual([1, 2]);
			expect(list.length).toBe(2);
			expect(list.firstNode!.next).toBe(oldFirstNode);
			list.prepend(0);

			expect([...list]).toStrictEqual([0, 1, 2]);
			expect(list.length).toBe(3);
			expect(list.firstNode!.previous).toBe(oldFirstNode);
			expect(list.firstNode!.next.previous).toBe(list.firstNode);
			expect(oldFirstNode!.next).toBe(list.firstNode);
		});
	});

	describe("pop", () => {
		it("returns undefined repeatedly on an empty list", () => {
			const list = DContainer.createCircularDoublyLinkedList<number>();
			const result = list.pop();

			type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

			expect(result).toBeUndefined();
			expect(list.pop()).toBeUndefined();
			expect([...list]).toStrictEqual([]);
			expect(list.length).toBe(0);
		});

		it.each([
			{
				values: [1],
				expected: [],
				removed: 1,
			},
			{
				values: [1, 2],
				expected: [1],
				removed: 2,
			},
			{
				values: [1, 2, 3],
				expected: [1, 2],
				removed: 3,
			},
		])("removes only the last value from $values", ({ values, expected, removed }) => {
			const list = DContainer.createCircularDoublyLinkedList(values);

			expect(list.pop()).toBe(removed);
			expect([...list]).toStrictEqual(expected);
			expect(list.length).toBe(expected.length);
		});

		it("drains the list and allows it to be reused", () => {
			const list = DContainer.createCircularDoublyLinkedList([1, 2, 3]);
			const firstNode = list.firstNode;

			expect(list.pop()).toBe(3);
			expect([...list]).toStrictEqual([1, 2]);
			expect(list.length).toBe(2);
			expect(list.firstNode).toBe(firstNode);
			expect(firstNode!.previous).toBe(firstNode!.next);
			expect(firstNode!.previous.next).toBe(firstNode);
			expect(list.pop()).toBe(2);
			expect([...list]).toStrictEqual([1]);
			expect(list.length).toBe(1);
			expect(firstNode!.next).toBe(firstNode);
			expect(firstNode!.previous).toBe(firstNode);
			expect(list.pop()).toBe(1);
			expect([...list]).toStrictEqual([]);
			expect(list.length).toBe(0);
			expect(list.pop()).toBeUndefined();
			list.add(4);
			expect([...list]).toStrictEqual([4]);
			expect(list.length).toBe(1);
			list.prepend(3);
			expect([...list]).toStrictEqual([3, 4]);
			expect(list.length).toBe(2);
		});
	});

	describe("shift", () => {
		it("returns undefined repeatedly on an empty list", () => {
			const list = DContainer.createCircularDoublyLinkedList<number>();
			const result = list.shift();

			type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

			expect(result).toBeUndefined();
			expect(list.shift()).toBeUndefined();
			expect([...list]).toStrictEqual([]);
			expect(list.length).toBe(0);
		});

		it("removes the only node and allows the list to be reused", () => {
			const list = DContainer.createCircularDoublyLinkedList([1]);

			expect(list.shift()).toBe(1);
			expect([...list]).toStrictEqual([]);
			expect(list.length).toBe(0);
			expect(list.shift()).toBeUndefined();
			list.prepend(2);
			expect([...list]).toStrictEqual([2]);
			expect(list.length).toBe(1);
		});

		it.each([
			{
				values: [1, 2],
				expected: [2],
			},
			{
				values: [1, 2, 3],
				expected: [2, 3],
			},
		])("keeps the remaining nodes linked after shifting $values", ({ values, expected }) => {
			const list = DContainer.createCircularDoublyLinkedList(values);
			const nextNode = list.firstNode!.next;
			const lastNode = list.firstNode!.previous;

			expect(list.shift()).toBe(1);
			expect(list.firstNode).toBe(nextNode);
			expect([...list]).toStrictEqual(expected);
			expect(list.length).toBe(expected.length);
			expect(list.firstNode!.previous).toBe(lastNode);
			expect(list.firstNode!.next.previous).toBe(nextNode);
			expect(lastNode.next).toBe(nextNode);
		});

		it("drains several nodes in first-in-first-out order", () => {
			const list = DContainer.createCircularDoublyLinkedList([1, 2, 3]);

			expect(list.shift()).toBe(1);
			expect(list.shift()).toBe(2);
			expect([...list]).toStrictEqual([3]);
			expect(list.length).toBe(1);
			expect(list.shift()).toBe(3);
			expect([...list]).toStrictEqual([]);
			expect(list.length).toBe(0);
			expect(list.shift()).toBeUndefined();
		});
	});

	describe("first and last", () => {
		it("returns undefined at both ends of an empty list", () => {
			const list = DContainer.createCircularDoublyLinkedList<number>();

			expect(list.first()).toBeUndefined();
			expect(list.last()).toBeUndefined();
		});

		it("returns the first value rather than its node without removing it", () => {
			const list = DContainer.createCircularDoublyLinkedList([1, 2, 3]);
			const result = list.first();

			type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

			expect(result).toBe(1);
			expect(list.first()).toBe(1);
			expect([...list]).toStrictEqual([1, 2, 3]);
			expect(list.length).toBe(3);
		});

		it("returns the last value reference rather than its node without removing it", () => {
			const first = { id: 1 };
			const last = { id: 2 };
			const list = DContainer.createCircularDoublyLinkedList([first, last]);
			const result = list.last();

			type _CheckResult = DCommon.ExpectType<typeof result, { id: number } | undefined, "strict">;

			expect(result).toBe(last);
			expect(list.last()).toBe(last);
			expect([...list]).toStrictEqual([first, last]);
			expect(list.length).toBe(2);
		});
	});

	describe("iteration", () => {
		it("completes immediately on an empty list", () => {
			const list = DContainer.createCircularDoublyLinkedList<number>();
			const iterator = list[Symbol.iterator]();

			expect(iterator.next().done).toBe(true);
			expect(iterator.next().done).toBe(true);
		});

		it("completes when the list is emptied during a traversal", () => {
			const list = DContainer.createCircularDoublyLinkedList([1]);
			const iterator = list[Symbol.iterator]();

			expect(iterator.next()).toEqual({
				value: 1,
				done: false,
			});
			list.shift();

			expect(list.length).toBe(0);
			expect(iterator.next().done).toBe(true);
			expect(iterator.next().done).toBe(true);
		});

		it.each([
			{ values: [1] },
			{ values: [1, 2, 3] },
			{ values: [1, 1, 1] },
		])("completes after exactly one turn through $values", ({ values }) => {
			const list = DContainer.createCircularDoublyLinkedList(values);
			const iterator = list[Symbol.iterator]();

			for (const value of values) {
				expect(iterator.next().done, `entry ${value}`).toBe(false);
			}

			expect(iterator.next().done).toBe(true);
			expect(iterator.next().done).toBe(true);
			expect([...list]).toStrictEqual(values);
			expect(list.length).toBe(values.length);
		});

		it("yields values in insertion order rather than nodes", () => {
			const list = DContainer.createCircularDoublyLinkedList([1, 2, 3]);
			const iterator = list[Symbol.iterator]();
			const steps = DArray.map([1, 2, 3], () => iterator.next());

			type _CheckIterator = DCommon.ExpectType<typeof iterator, ReturnType<Iterable<number, unknown>[typeof Symbol.iterator]>, "strict">;

			expect(iterator.next().done).toBe(true);
			expect(steps).toEqual([
				{
					value: 1,
					done: false,
				},
				{
					value: 2,
					done: false,
				},
				{
					value: 3,
					done: false,
				},
			]);
		});

		it("provides independent iterators and supports a new traversal after a mutation", () => {
			const list = DContainer.createCircularDoublyLinkedList([1, 2]);
			const firstIterator = list[Symbol.iterator]();
			const secondIterator = list[Symbol.iterator]();

			expect(firstIterator === secondIterator).toBe(false);
			expect(firstIterator.next()).toStrictEqual(secondIterator.next());
			expect(firstIterator.next().done).toBe(false);
			expect(firstIterator.next().done).toBe(true);
			expect(secondIterator.next().done).toBe(false);
			expect(secondIterator.next().done).toBe(true);
			list.prepend(0);
			list.pop();
			const nextIterator = list[Symbol.iterator]();

			expect(nextIterator.next().done).toBe(false);
			expect(nextIterator.next().done).toBe(false);
			expect(nextIterator.next().done).toBe(true);
			expect([...list]).toStrictEqual([0, 1]);
			expect(list.length).toBe(2);
		});
	});

	it.each(["pop", "shift"] as const)("removes an undefined entry with %s without confusing it with an empty list", (operation) => {
		const list = DContainer.createCircularDoublyLinkedList([undefined]);

		expect([...list]).toStrictEqual([undefined]);
		expect(list.length).toBe(1);
		expect(list[operation]()).toBeUndefined();
		expect([...list]).toStrictEqual([]);
		expect(list.length).toBe(0);
	});

	it.each(["pop", "shift"] as const)("preserves the removed object reference with %s", (operation) => {
		const value = { id: 1 };
		const list = DContainer.createCircularDoublyLinkedList([value]);

		expect(list[operation]()).toBe(value);
		expect([...list]).toStrictEqual([]);
		expect(list.length).toBe(0);
	});

	it("preserves the element type and readonly node contract", () => {
		const list = DContainer.createCircularDoublyLinkedList<"ready" | "done">(["ready"]);
		const node = list.firstNode!;

		type _CheckNode = DCommon.ExpectType<typeof node, DContainer.CircularDoublyLinkedListNode<"ready" | "done">, "strict">;
		type _CheckValue = DCommon.ExpectType<typeof node.value, "ready" | "done", "strict">;
		type _CheckNext = DCommon.ExpectType<typeof node.next, typeof node, "strict">;
		type _CheckPrevious = DCommon.ExpectType<typeof node.previous, typeof node, "strict">;
		type _CheckNodeReadonly = DCommon.ExpectType<Pick<typeof node, "value" | "next" | "previous">, {
			readonly value: "ready" | "done";
			readonly next: typeof node;
			readonly previous: typeof node;
		}, "strict">;
		type _CheckListReadonly = DCommon.ExpectType<Pick<typeof list, "firstNode" | "length">, {
			readonly firstNode: typeof node | undefined;
			readonly length: number;
		}, "strict">;
		type _CheckAdd = DCommon.ExpectType<Parameters<typeof list.add>, [value: "ready" | "done"], "strict">;
		type _CheckPrepend = DCommon.ExpectType<Parameters<typeof list.prepend>, [value: "ready" | "done"], "strict">;

		list.add("done");

		expect([...list]).toStrictEqual(["ready", "done"]);
		expect(list.length).toBe(2);
	});
});
