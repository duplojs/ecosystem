/**
 * @title DSPath.create
 *
 * Normaliser un chemin de plateforme et retourner un Either.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

// La normalisation suit les règles de DSPath.normalize, sans accéder au fichier.
const result = DSPath.create("src/../index.ts");
// Success contient "index.ts" ; en cas de refus, le Left contient l'entrée originale.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<string & DPath.Path> | DEither.Left<"create-path-error", string>,
	"strict"
>;

