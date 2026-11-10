/**
 * @title DSFile.realPath
 *
 * Résoudre le chemin réel d’une entrée.
 */
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;

const result = await DSFile.realPath(path);

// Le résultat dépend de l’état du système de fichiers et des liens.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-real-path-not-found": () => "missing",
			"file-system-real-path-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-real-path-not-found
// file-system-real-path-permission-denied
// file-system-real-path-not-directory
// file-system-real-path-too-many-open-files
// file-system-real-path-error
