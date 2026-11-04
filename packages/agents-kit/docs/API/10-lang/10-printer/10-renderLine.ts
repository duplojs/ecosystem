/**
 * @title DPrinter.renderLine
 *
 * Assembler récursivement des valeurs en séparant les éléments par une espace.
 */
import * as DPrinter from "@duplojs/lang/printer";
import type * as DCommon from "@duplojs/lang/common";

const line = DPrinter.renderLine(["Nom", [true, "Ada"], false]);

// La valeur obtenue est "Nom true Ada" ; false ne produit aucun texte.
type _CheckLine = DCommon.ExpectType<typeof line, string, "strict">;
