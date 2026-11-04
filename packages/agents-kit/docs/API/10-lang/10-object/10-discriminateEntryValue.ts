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

declare const entry: Entry;

if (DObject.discriminateEntryValue(entry, DCommon.isType("string"))) {
	type _CheckIfValue = DCommon.ExpectType<typeof entry[1], string, "strict">;
	const [, name] = entry;
	type _CheckIfName = DCommon.ExpectType<typeof name, string, "strict">;
}

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

			return narrowedEntry[1];
		},
	),
);

// La valeur est extraite avec le type string lorsque le predicate réussit ; sinon l’entrée version est conservée.
type _CheckPreserved = DCommon.ExpectType<
	typeof value,
	string | readonly ["version", number],
	"strict"
>;
