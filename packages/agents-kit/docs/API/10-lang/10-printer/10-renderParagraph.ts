/**
 * @title DPrinter.renderParagraph
 *
 * Assembler récursivement des valeurs en séparant les éléments par un saut de ligne.
 */
import * as DPrinter from "@duplojs/lang/printer";
import type * as DCommon from "@duplojs/lang/common";

const paragraph = DPrinter.renderParagraph([
	"Première ligne",
	["Deuxième ligne", false],
	"Troisième ligne",
]);

// La valeur obtenue est "Première ligne\nDeuxième ligne\nTroisième ligne".
type _CheckParagraph = DCommon.ExpectType<typeof paragraph, string, "strict">;
