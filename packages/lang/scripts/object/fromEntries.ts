import type * as DCommon from "@scripts/common";

type FromEntriesOutput<
	GenericEntry extends DCommon.ObjectEntry,
> = DCommon.UnionContain<DCommon.ObjectKey, GenericEntry[0]> extends true
	? DCommon.SimplifyTopLevel<{
		[Entry in GenericEntry as Entry[0]]: Entry[1]
	}>
	: DCommon.SimplifyTopLevel<{
		[Entry in GenericEntry as Entry[0]]?: Entry[1]
	}>;

export function fromEntries<
	GenericKey extends DCommon.ObjectKey,
	const GenericEntry extends readonly [GenericKey, unknown],
>(
	entries: Iterable<GenericEntry>,
): FromEntriesOutput<GenericEntry>;

export function fromEntries(
	entries: Iterable<readonly [DCommon.ObjectKey, unknown]>,
): object {
	return Object.fromEntries(entries) as never;
}
