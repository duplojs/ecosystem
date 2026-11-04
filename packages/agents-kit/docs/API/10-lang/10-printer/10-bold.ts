/**
 * @title DPrinter.bold
 *
 * Encadrer une chaîne par les codes ANSI de mise en gras.
 */
import * as DPrinter from "@duplojs/lang/printer";
import type * as DCommon from "@duplojs/lang/common";

const emphasized = DPrinter.bold("Attention");

// La valeur obtenue est "\x1B[1mAttention\x1B[0m".
type _CheckEmphasized = DCommon.ExpectType<typeof emphasized, string, "strict">;
