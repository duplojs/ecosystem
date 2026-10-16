/**
 * @title DCommon.cast
 *
 * Vérifier au niveau du typage qu’une valeur respecte une contrainte attendue.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

const result: string & DString.MinCharacters<10> = DCommon.cast("thisIsASuperName");

// La compatibilité est vérifiée par TypeScript ; cast n’ajoute aucune validation runtime.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	string & DString.MinCharacters<10>,
	"strict"
>;
