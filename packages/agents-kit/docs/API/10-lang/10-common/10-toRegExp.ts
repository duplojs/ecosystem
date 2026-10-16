/**
 * @title DCommon.toRegExp
 *
 * Convertir une chaîne, un tuple de chaînes ou une expression régulière en `RegExp`.
 */
import * as DCommon from "@duplojs/lang/common";

const fromString = DCommon.toRegExp("file.name");
const fromTuple = DCommon.toRegExp(["pending", "done"] as const);
const existing = /^(pending|done)$/;
const fromRegExp = DCommon.toRegExp(existing);

// Une chaîne devient un motif exact et ses caractères spéciaux sont échappés.
// Un tuple devient une alternative exacte ; une RegExp existante est réutilisée.
type _CheckString = DCommon.ExpectType<typeof fromString, RegExp, "strict">;
type _CheckTuple = DCommon.ExpectType<typeof fromTuple, RegExp, "strict">;
type _CheckRegExp = DCommon.ExpectType<typeof fromRegExp, RegExp, "strict">;
