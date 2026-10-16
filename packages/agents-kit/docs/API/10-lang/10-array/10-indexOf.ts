/**
 * @title DArray.indexOf
 *
 * Lire l’index de la première occurrence d’une valeur, ou undefined.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const values = ["a", "b", "a"] as const;

// Appel classique : la recherche commence au début par défaut.
const result = DArray.indexOf(values, "a");

// La valeur obtenue est 0 ; l’absence de correspondance est représentée par undefined.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

// Appel curifié : l’élément recherché est fixé dans l’étape du pipe.
const piped = DCommon.pipe(
	values,
	DArray.indexOf("a"),
);

// La valeur obtenue est 0.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
