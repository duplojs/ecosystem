import type * as DCommon from "@scripts/common";

export function discriminateEntryValue<
	GenericEntry extends readonly [string, unknown],
	GenericPredicateEntryValue extends GenericEntry[1],
>(
	predicate: (value: GenericEntry[1]) => value is GenericPredicateEntryValue,
): (
	entry: GenericEntry,
) => entry is Extract<
	DCommon.CleanObjectEntry<GenericEntry>,
	[string, GenericPredicateEntryValue]
>;

export function discriminateEntryValue<
	GenericEntry extends readonly [string, unknown],
>(
	predicate: (value: GenericEntry[1]) => boolean,
): (
	entry: GenericEntry,
) => boolean;

export function discriminateEntryValue<
	GenericEntry extends readonly [string, unknown],
	GenericPredicateEntryValue extends GenericEntry[1],
>(
	entry: GenericEntry,
	predicate: (value: GenericEntry[1]) => value is GenericPredicateEntryValue,
): entry is Extract<
	DCommon.CleanObjectEntry<GenericEntry>,
	[string, GenericPredicateEntryValue]
>;

export function discriminateEntryValue<
	GenericEntry extends readonly [string, unknown],
>(
	entry: GenericEntry,
	predicate: (value: GenericEntry[1]) => boolean,
): boolean;

export function discriminateEntryValue(
	...args:
		| [predicate: DCommon.AnyFunction]
		| [entry: readonly [string, unknown], predicate: DCommon.AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (entry: readonly [string, unknown]) => discriminateEntryValue(
			entry,
			predicate as never,
		);
	}

	const [entry, predicate] = args;

	return predicate(entry[1]);
}
