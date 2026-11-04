/**
 * @title DPrinter.colorized
 *
 * Encadrer une chaîne par les codes ANSI d’une couleur sélectionnée.
 */
import * as DPrinter from "@duplojs/lang/printer";
import * as DCommon from "@duplojs/lang/common";

// Appel direct : la valeur obtenue est "\x1B[32mEnregistré\x1B[0m".
const saved = DPrinter.colorized("Enregistré", "green");
type _CheckSaved = DCommon.ExpectType<typeof saved, string, "strict">;

// Appel curifié dans un pipe : la valeur obtenue est "\x1B[34mEn attente\x1B[0m".
const status = DCommon.pipe(
	"En attente",
	DPrinter.colorized("blue"),
);
type _CheckStatus = DCommon.ExpectType<typeof status, string, "strict">;
