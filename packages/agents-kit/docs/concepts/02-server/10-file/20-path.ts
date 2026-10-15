/**
 * @title Chemins typés
 *
 * Contraintes `Path`, `Absolute` et `Segment` pour valider, extraire et résoudre des chemins Unix.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";

// Un chemin reste une string, enrichie par des contraintes de typage.
const imagePath: string & DPath.Path = DCommon.cast("resources/images/avatar.png");
const rootPath: string & DPath.Path & DPath.Absolute = DCommon.cast("/resources");
const fileSegment: string & DPath.Segment = DCommon.cast("avatar.png");

// Une string dynamique doit être validée avant d'être utilisée comme `Path`.
declare const unsafePath: string;

const pathResult = DPath.create(unsafePath);

if (DEither.isRight(pathResult)) {
	// string & DPath.Path
	const path = DEither.unwrapRight(pathResult);
}

// Les helpers extraient des parties contraintes sans retravailler la string.
// (string & DPath.Segment) | null
const fileName = DPath.getBaseName(imagePath);

// (string & DPath.Segment) | null
const extensionName = DPath.getExtensionName(imagePath);

// (string & DPath.Path) | null
const parentFolderPath = DPath.getParentFolderPath(imagePath);

// Les fonctions de résolution assemblent des `Path` et `Segment` validés.
// (string & DPath.Absolute) | null
const resolvedPath = DPath.resolveFrom(
	rootPath,
	[
		DCommon.infer("assets"),
		fileSegment,
	],
	{
		stayInOrigin: true,
	},
);

// Résolution sans origine protectrice.
// string & DPath.Path & DPath.Absolute
const relativePath = DPath.resolveRelative(
	[
		rootPath,
		DCommon.infer("assets/logo"),
		DCommon.infer("logo1.png"),
	],
);
