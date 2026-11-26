import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";

export const setKind = createKind("set");

export interface ReadonlySet<
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof setKind>, Iterable<GenericValue, unknown> {
	readonly size: number;
	readonly has: DCommon.Forward<(value: GenericValue) => boolean>;
}

export interface Set<
	GenericValue extends unknown = unknown,
> extends ReadonlySet<GenericValue> {
	readonly add: DCommon.Forward<(value: GenericValue) => void>;
	readonly delete: DCommon.Forward<(value: GenericValue) => boolean>;
}

class _Set implements DKind.Remove<Set> {
	private readonly set: globalThis.Set<unknown>;

	public constructor(values?: Iterable<unknown>) {
		this.set = new globalThis.Set(values);
	}

	public get size() {
		return this.set.size;
	}

	public has(value: unknown) {
		return this.set.has(value);
	}

	public add(value: unknown): void {
		this.set.add(value);
	}

	public delete(value: unknown) {
		return this.set.delete(value);
	}

	public [Symbol.iterator]() {
		return this.set[Symbol.iterator]();
	}

	public [setKind.runTimeKey] = null;
}

export function createSet<
	GenericValue extends unknown = unknown,
>(
	values?: Iterable<GenericValue>,
): Set<GenericValue> {
	return new _Set(values) as never;
}
