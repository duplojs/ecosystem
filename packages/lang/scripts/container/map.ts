import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";

export const mapKind = createKind("map");

export interface ReadonlyMap<
	GenericKey extends unknown = unknown,
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof mapKind>, Iterable<readonly [GenericKey, GenericValue], unknown> {
	readonly size: number;
	readonly get: DCommon.Forward<(key: GenericKey) => GenericValue | undefined>;
	readonly has: DCommon.Forward<(key: GenericKey) => boolean>;
}

export interface Map<
	GenericKey extends unknown = unknown,
	GenericValue extends unknown = unknown,
> extends ReadonlyMap<GenericKey, GenericValue> {
	readonly set: DCommon.Forward<(key: GenericKey, value: GenericValue) => void>;
	readonly delete: DCommon.Forward<(key: GenericKey) => boolean>;
}

class _Map implements DKind.Remove<Map> {
	private readonly map: globalThis.Map<unknown, unknown>;

	public constructor(entries?: Iterable<readonly [unknown, unknown]>) {
		this.map = new globalThis.Map(entries);
	}

	public get size() {
		return this.map.size;
	}

	public get(key: unknown) {
		return this.map.get(key);
	}

	public has(key: unknown) {
		return this.map.has(key);
	}

	public set(key: unknown, value: unknown): void {
		this.map.set(key, value);
	}

	public delete(key: unknown) {
		return this.map.delete(key);
	}

	public [Symbol.iterator]() {
		return this.map[Symbol.iterator]();
	}

	public [mapKind.runTimeKey] = null;
}

export function createMap<
	GenericKey extends unknown = unknown,
	GenericValue extends unknown = unknown,
>(
	entries?: Iterable<readonly [GenericKey, GenericValue]>,
): Map<GenericKey, GenericValue> {
	return new _Map(entries) as never;
}
