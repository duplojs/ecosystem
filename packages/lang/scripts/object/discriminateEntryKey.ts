import type * as DCommon from "@scripts/common";

export function discriminateEntryKey<
	GenericEntry extends readonly [string, unknown],
	GenericPredicateEntryKey extends GenericEntry[0],
>(
	predicate: (key: GenericEntry[0]) => key is GenericPredicateEntryKey,
): (
	entry: GenericEntry,
) => entry is Extract<
	DCommon.CleanObjectEntry<GenericEntry>,
	[GenericPredicateEntryKey, unknown]
>;

export function discriminateEntryKey<
	GenericEntry extends readonly [string, unknown],
>(
	predicate: (key: GenericEntry[0]) => boolean,
): (
	entry: GenericEntry,
) => boolean;

export function discriminateEntryKey<
	GenericEntry extends readonly [string, unknown],
	GenericPredicateEntryKey extends GenericEntry[0],
>(
	entry: GenericEntry,
	predicate: (key: GenericEntry[0]) => key is GenericPredicateEntryKey,
): entry is Extract<
	DCommon.CleanObjectEntry<GenericEntry>,
	[GenericPredicateEntryKey, unknown]
>;

export function discriminateEntryKey<
	GenericEntry extends readonly [string, unknown],
>(
	entry: GenericEntry,
	predicate: (key: GenericEntry[0]) => boolean,
): boolean;

export function discriminateEntryKey(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [entry: readonly [string, unknown], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (entry: readonly [string, unknown]) => discriminateEntryKey(
			entry,
			predicate as never,
		);
	}

	const [entry, predicate] = args;

	return predicate(entry[0]);
}
