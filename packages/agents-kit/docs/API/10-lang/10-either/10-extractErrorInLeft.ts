/**
 * @title DEither.extractErrorInLeft
 *
 * Extraire d’un Left les erreurs DuploJS sélectionnées par leur identifiant.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

class MissingError extends DCommon.DuploJSError.parentClass("missing") {}
class ForbiddenError extends DCommon.DuploJSError.parentClass("forbidden") {}
class UnexpectedError extends DCommon.DuploJSError.parentClass("unexpected") {}

type LoadResult = (
	| DEither.Left<"load-error", MissingError | ForbiddenError | UnexpectedError>
	| DEither.Right<"success", string>
	| null
);

declare const result: LoadResult;

// Appel classique : l’erreur sélectionnée reçoit son identifiant comme information.
const extracted = DEither.extractErrorInLeft(result, "missing");
type _CheckExtracted = DCommon.ExpectType<
	typeof extracted,
	| DEither.Left<"load-error", ForbiddenError | UnexpectedError>
	| DEither.Left<"missing", MissingError>
	| DEither.Right<"success", string>
	| null,
	"strict"
>;

// Appel curifié : extraire plusieurs erreurs avant de traiter l’erreur restante.
const separated = DCommon.pipe(
	result,
	DEither.extractErrorInLeft(["missing", "forbidden"]),
);
type _CheckSeparated = DCommon.ExpectType<
	typeof separated,
	| DEither.Left<"load-error", UnexpectedError>
	| DEither.Left<"missing", MissingError>
	| DEither.Left<"forbidden", ForbiddenError>
	| DEither.Right<"success", string>
	| null,
	"strict"
>;
