/**
 * @title DEither.unwrapOtherwise
 *
 * Extraire la valeur d’un Right ou calculer une valeur de remplacement pour les autres cas.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const direct = DEither.unwrapOtherwise(
	DEither.left("missing"),
	() => "fallback" as const,
);
type _CheckDirect = DCommon.ExpectType<typeof direct, "fallback", "strict">;

const piped = DCommon.pipe(
	DEither.success("saved"),
	DEither.unwrapOtherwise(() => "fallback" as const),
);
// La callback de remplacement n’est pas utilisée pour un Right.
type _CheckPiped = DCommon.ExpectType<typeof piped, "saved" | "fallback", "strict">;
