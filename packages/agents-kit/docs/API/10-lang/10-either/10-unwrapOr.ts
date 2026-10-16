/**
 * @title DEither.unwrapOr
 *
 * Extraire la valeur d’un Right ou fournir une valeur de remplacement.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const direct = DEither.unwrapOr(DEither.success("saved"), "fallback" as const);
type _CheckDirect = DCommon.ExpectType<typeof direct, "saved" | "fallback", "strict">;

const piped = DCommon.pipe(
	DEither.left("missing"),
	DEither.unwrapOr("fallback" as const),
);
// Le Left prend la valeur de remplacement.
type _CheckPiped = DCommon.ExpectType<typeof piped, "fallback", "strict">;
