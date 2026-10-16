/**
 * @title DCommon.whenElse
 *
 * Choisir une transformation selon le résultat d’un prédicat.
 */
import * as DCommon from "@duplojs/lang/common";

declare const input: string | number;

// Appel classique : les deux branches retournent la valeur sélectionnée.
const result = DCommon.whenElse(
	input,
	DCommon.isType("string"),
	DCommon.forward,
	DCommon.forward,
);
type _CheckResult = DCommon.ExpectType<typeof result, string | number, "strict">;

// Appel curifié : configurer le choix dans une étape de pipe.
const piped = DCommon.pipe(
	input,
	DCommon.whenElse(
		DCommon.isType("string"),
		DCommon.forward,
		DCommon.forward,
	),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, string | number, "strict">;
