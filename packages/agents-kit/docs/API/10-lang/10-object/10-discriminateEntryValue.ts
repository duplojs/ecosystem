/**
 * @title DObject.discriminateEntryValue
 *
 * Tester ou affiner une entrée selon sa valeur.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

type Entry =
	| readonly ["name", string]
	| readonly ["version", number];
type VersionEntry = Extract<Entry, readonly ["version", number]>;

declare const entry: Entry;
const result = DObject.discriminateEntryValue(entry, DCommon.isType("string"));

// La valeur obtenue est true lorsque la valeur de l’entrée est une chaîne.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée est passée directement comme predicate à DCommon.when.
const value = DCommon.pipe(
	entry,
	DCommon.when(
		DObject.discriminateEntryValue(DCommon.isType("string")),
		(narrowedEntry) => {
			type _CheckPredicatedValue = DCommon.ExpectType<typeof narrowedEntry[1], string, "strict">;

			return DObject.getProperty(narrowedEntry, 1);
		},
	),
);

// La valeur est extraite avec le type string lorsque le predicate réussit ; sinon l’entrée est conservée.
type _CheckPreserved = DCommon.ExpectType<
	typeof value,
	string | VersionEntry,
	"one-extends-two"
>;
