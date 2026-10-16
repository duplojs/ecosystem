/**
 * @title DArray.lastIndexOf
 *
 * Lire l’index de la dernière occurrence d’une valeur, ou undefined.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const values = ["a", "b", "a"] as const;

// Appel classique : la recherche commence à la fin par défaut.
const result = DArray.lastIndexOf(values, "a");

// La valeur obtenue est 2 ; l’absence de correspondance est représentée par undefined.
type _CheckResult = DCommon.ExpectType<typeof result, number | undefined, "strict">;

// Appel curifié : l’élément recherché est fixé dans l’étape du pipe.
const piped = DCommon.pipe(
	values,
	DArray.lastIndexOf("a"),
);

// La valeur obtenue est 2.
type _CheckPiped = DCommon.ExpectType<typeof piped, number | undefined, "strict">;
