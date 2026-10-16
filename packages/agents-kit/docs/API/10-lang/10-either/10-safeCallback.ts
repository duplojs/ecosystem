/**
 * @title DEither.safeCallback
 *
 * Convertir une valeur ou une exception d’une callback en Either.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const success = DEither.safeCallback(() => "saved" as const);
// Une valeur brute devient SafeCallbackSuccess ; la capture d’une exception reste dans le contrat.
type _CheckSuccess = DCommon.ExpectType<
	typeof success,
	DEither.SafeCallbackSuccess<"saved"> | DEither.SafeCallbackError,
	"strict"
>;

const existing = DEither.safeCallback(() => DEither.left("missing"));
// Un Either déjà produit par la callback est conservé, avec le Left réservé aux exceptions.
type _CheckExisting = DCommon.ExpectType<
	typeof existing,
	DEither.Left<"missing", undefined> | DEither.SafeCallbackError,
	"strict"
>;

const failure = DEither.safeCallback(() => {
	throw new Error("unexpected");
});
// Une exception devient SafeCallbackError et sa valeur reste inconnue.
type _CheckFailure = DCommon.ExpectType<typeof failure, DEither.SafeCallbackError, "strict">;
