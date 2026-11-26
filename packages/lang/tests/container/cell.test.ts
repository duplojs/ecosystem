import type * as DCommon from "@scripts/common";
import * as DContainer from "@scripts/container";

describe("createCell", () => {
	it("creates an undefined cell without a value", () => {
		const cell = DContainer.createCell();

		type _CheckCell = DCommon.ExpectType<typeof cell, DContainer.Cell<unknown>, "strict">;

		expect(cell.value).toBeUndefined();
	});

	it("includes undefined when only the generic is provided", () => {
		const cell = DContainer.createCell<number>();

		type _CheckCell = DCommon.ExpectType<typeof cell, DContainer.Cell<number | undefined>, "strict">;

		expect(cell.value).toBeUndefined();
		cell.set(42);
		expect(cell.value).toBe(42);
		cell.set(undefined);
		expect(cell.value).toBeUndefined();
	});

	it("infers the initial value type", () => {
		const cell = DContainer.createCell(42);

		type _CheckCell = DCommon.ExpectType<typeof cell, DContainer.Cell<number>, "strict">;
		type _CheckSet = DCommon.ExpectType<typeof cell.set, (value: number) => void, "strict">;
		type _CheckReadonlyValue = DCommon.ExpectType<Pick<typeof cell, "value">, { readonly value: number }, "strict">;

		expect(cell.value).toBe(42);
	});

	it.each([
		undefined,
		null,
		false,
		0,
		"",
	])("preserves the initial value %s", (value) => {
		const cell = DContainer.createCell(value);

		expect(cell.value).toBe(value);
	});

	it("replaces the value through set and returns void", () => {
		const cell = DContainer.createCell<string | number>("initial");
		const result = cell.set(42);

		type _CheckResult = DCommon.ExpectType<typeof result, void, "strict">;

		expect(result).toBeUndefined();
		expect(cell.value).toBe(42);
		cell.set("updated");
		expect(cell.value).toBe("updated");
	});

	it("keeps object references without changing the previous value", () => {
		const initial = { count: 1 };
		const replacement = { count: 2 };
		const cell = DContainer.createCell(initial);

		expect(cell.value).toBe(initial);
		cell.set(replacement);
		expect(cell.value).toBe(replacement);
		expect(initial).toStrictEqual({ count: 1 });
	});

	it("exposes the current value through a readonly cell", () => {
		const cell = DContainer.createCell(1);
		const readonlyCell: DContainer.ReadonlyCell<number> = cell;

		type _CheckValue = DCommon.ExpectType<typeof readonlyCell.value, number, "strict">;
		type _CheckReadonlyValue = DCommon.ExpectType<Pick<typeof readonlyCell, "value">, { readonly value: number }, "strict">;
		type _CheckKeys = DCommon.ExpectType<Extract<keyof typeof readonlyCell, "set">, never, "strict">;

		cell.set(2);

		expect(readonlyCell.value).toBe(2);
	});

	it("rejects widening a mutable cell while allowing a wider readonly view", () => {
		const cell = DContainer.createCell(1);
		const readonlyCell: DContainer.ReadonlyCell<number | string> = cell;

		// @ts-expect-error widening a mutable cell would allow incompatible writes
		const widenedCell: DContainer.Cell<number | string> = cell;

		expect(widenedCell).toBe(cell);
		expect(readonlyCell.value).toBe(1);
	});

	it("creates independent cells carrying the cell kind", () => {
		const first = DContainer.createCell(1);
		const second = DContainer.createCell(1);

		first.set(2);

		expect(first).not.toBe(second);
		expect(second.value).toBe(1);
		expect(DContainer.cellKind.has(first)).toBe(true);
		expect(DContainer.cellKind.getValue(first)).toBeNull();
		expect(DContainer.cellKind.has({ value: 1 })).toBe(false);
	});
});
