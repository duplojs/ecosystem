/**
 * @title DSFile.setTime
 *
 * Modifier les dates d’accès et de modification d’une entrée.
 */
import type * as DChrono from "@duplojs/lang/chrono";
import type * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";

declare const path: string & DPath.Path;
declare const date: DChrono.TheDate;

const result = await DSFile.setTime(path, {
	accessTime: date,
	modifiedTime: date,
});

// Le résultat indique si les métadonnées ont été modifiées.

// L’information du Left identifie l’opération ; sa valeur précise la cause.
if (DEither.isLeft(result)) {
	const error = DEither.unwrapLeft(result);

	const diagnosis = DPattern.matchWithErrorOtherwise(
		error,
		{
			"file-system-set-time-not-found": () => "missing",
			"file-system-set-time-permission-denied": () => "access-denied",
		},
		(otherError) => otherError,
	);
}

// Identifiants d’erreur déclarés pour cette opération :
// file-system-set-time-not-found
// file-system-set-time-permission-denied
// file-system-set-time-not-directory
// file-system-set-time-read-only
// file-system-set-time-invalid-argument
// file-system-set-time-error
