/**
 * @title DArray.notIncludes
 *
 * Vérifier qu’un tableau ne contient pas une valeur.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const colors: readonly string[] = ["red", "green"];

// Appel classique : la valeur recherchée est absente du tableau.
const result = DArray.notIncludes(colors, "blue");

// La valeur obtenue est true.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// Appel curifié : la valeur est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	colors,
	DArray.notIncludes("red"),
);

// La valeur obtenue est false.
type _CheckPiped = DCommon.ExpectType<typeof piped, boolean, "strict">;
