/**
 * @title DPrinter.indent
 *
 * Produire une chaîne contenant le nombre demandé de tabulations.
 */
import * as DPrinter from "@duplojs/lang/printer";
import type * as DCommon from "@duplojs/lang/common";

// Deux niveaux produisent "\t\t".
const nestedIndent = DPrinter.indent(2);
type _CheckNestedIndent = DCommon.ExpectType<typeof nestedIndent, string, "strict">;

// Une profondeur négative produit "".
const rootIndent = DPrinter.indent(-1);
type _CheckRootIndent = DCommon.ExpectType<typeof rootIndent, string, "strict">;

// Les niveaux non finis sont ignorés ; une fraction positive est tronquée.
const fractional = DPrinter.indent(2.5);
// La valeur obtenue est "\t\t".
type _CheckFractional = DCommon.ExpectType<typeof fractional, string, "strict">;
