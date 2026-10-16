/**
 * @title DArray.includes
 *
 * Vérifier qu’un tableau contient une valeur.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const colors: readonly string[] = ["red", "green"];

// Appel classique : la valeur est comparée aux éléments du tableau.
const result = DArray.includes(colors, "green");

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : la valeur recherchée est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	colors,
	DArray.includes("blue"),
);

// La valeur obtenue est false.
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
