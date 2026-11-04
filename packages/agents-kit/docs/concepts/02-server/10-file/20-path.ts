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
	const path = DEither.unwrapRight(pathResult);
	type _CheckPathLine22 = DCommon.ExpectType<
	typeof path,
	string & DPath.Path,
	"strict"
	>;
}

// Les helpers extraient des parties contraintes sans retravailler la string.
const fileName = DPath.getBaseName(imagePath);
type _CheckFileName = DCommon.ExpectType<typeof fileName, (string & DPath.Segment & DPath.Path) | null, "strict">;

const extensionName = DPath.getExtensionName(imagePath);
type _CheckExtensionNameLine30 = DCommon.ExpectType<
	typeof extensionName,
	(string & DPath.Segment & DPath.Path) | null,
	"strict"
>;

const parentFolderPath = DPath.getParentFolderPath(imagePath);
type _CheckParentFolderPathLine33 = DCommon.ExpectType<
	typeof parentFolderPath,
	(string & DPath.Path) | null,
	"strict"
>;

// Les fonctions de résolution assemblent des `Path` et `Segment` validés.
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
type _CheckResolvedPath = DCommon.ExpectType<
	typeof resolvedPath,
	(string & DPath.Path & DPath.Absolute) | null,
	"strict"
>;

// Résolution sans origine protectrice.
const relativePath = DPath.resolveRelative(
	[
		rootPath,
		DCommon.infer("assets/logo"),
		DCommon.infer("logo1.png"),
	],
);
type _CheckRelativePath = DCommon.ExpectType<typeof relativePath, string & DPath.Path & DPath.Absolute, "strict">;
