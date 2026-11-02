/**
 * @title DObject.discriminateEntryKey
 *
 * Tester ou affiner une entrée selon sa clé.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

type Entry =
	| readonly ["name", DCommon.AnyValue]
	| readonly ["version", DCommon.AnyValue];
type VersionEntry = Extract<Entry, readonly ["version", DCommon.AnyValue]>;

declare const entry: Entry;
const result = DObject.discriminateEntryKey(entry, DCommon.equal("name"));

// La valeur obtenue est true pour l’entrée dont la clé vaut name.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée est passée directement comme predicate à DCommon.when.
const key = DCommon.pipe(
	entry,
	DCommon.when(
		DObject.discriminateEntryKey(DCommon.equal("name")),
		(narrowedEntry) => {
			type _CheckPredicatedKey = DCommon.ExpectType<typeof narrowedEntry[0], "name", "strict">;

			return DObject.getProperty(narrowedEntry, 0);
		},
	),
);

// La clé name est extraite lorsque le predicate réussit ; sinon l’entrée est conservée.
type _CheckPreserved = DCommon.ExpectType<
	typeof key,
	"name" | VersionEntry,
	"one-extends-two"
>;
