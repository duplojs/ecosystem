import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import type * as DCommon from "@scripts/common";

export const cellKind = createKind("cell");

export interface ReadonlyCell<
	GenericElement extends unknown = unknown,
> extends DKind.Kind<typeof cellKind> {
	readonly value: GenericElement;
}

export interface Cell<
	GenericElement extends unknown = unknown,
> extends ReadonlyCell<GenericElement> {
	readonly set: DCommon.Forward<(value: GenericElement) => void>;
}

class _Cell implements DKind.Remove<Cell> {
	public constructor(defaultValue: unknown) {
		this.value = defaultValue;
	}

	public value: unknown = undefined;

	public set(newValue: unknown) {
		this.value = newValue;
	}

	public [cellKind.runTimeKey] = null;
}

export function createCell<
	GenericValue extends unknown = unknown,
>(): Cell<GenericValue | undefined>;

export function createCell<
	GenericValue extends unknown = unknown,
>(
	value: GenericValue,
): Cell<GenericValue>;

export function createCell(defaultValue?: unknown): any {
	return new _Cell(defaultValue);
}
