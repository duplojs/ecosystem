/**
 * @title DSPath.toPlatformPath
 *
 * Convertir un chemin DuploJS en chaîne utilisable par la plateforme courante.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

// Hors Windows, le chemin reste inchangé. Sur Windows :
// /DRV-C:/a -> C:\a ; /UNC:/server/share/a -> \\server\share\a ;
// /DEVICE:/pipe/name -> \\.\pipe\name.
// /DEVICE:/Volume{...} et /DEVICE:/GLOBALROOT utilisent le préfixe \\?\.
// Les segments DRV-X: sont restaurés en X:, y compris à l'intérieur du chemin.
const drive = DSPath.toPlatformPath(DPath.declareAbsolutePath("/DRV-C:/work/file.txt"));
// Windows : Success contient "C:\\work\\file.txt" ; ailleurs : le chemin d'entrée.
type _CheckDrive = DCommon.ExpectType<
	typeof drive,
	DEither.Success<string> | DEither.Left<"to-platform-path-error", DPath.AnyPath>,
	"strict"
>;

// Les chemins relatifs restent relatifs. Sur Windows, les / deviennent des \ ;
// les \ déjà présents dans un segment sont remplacés par _ avant conversion.
const relative = DSPath.toPlatformPath(DPath.declarePath("src/file.txt"));
// Windows : "src\\file.txt" ; ailleurs : "src/file.txt".
type _CheckRelative = DCommon.ExpectType<
	typeof relative,
	DEither.Success<string> | DEither.Left<"to-platform-path-error", DPath.AnyPath>,
	"strict"
>;

// Un chemin absolu sans espace de noms utilise le lecteur courant. S'il est
// indisponible, ou si un UNC ou DEVICE est incomplet, le Left porte l'entrée.
// La conversion ne vérifie pas l'existence ni la validité système du chemin.
