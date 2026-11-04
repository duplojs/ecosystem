/**
 * @title DPath.normalize
 *
 * Réduire les séparateurs et les segments relatifs d’un chemin.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const result = DPath.normalize("src//module/../index.ts");
// La valeur obtenue est src/index.ts ; null signale une entrée invalide.
type _CheckResult = DCommon.ExpectType<typeof result, (string & DPath.Path) | null, "strict">;

// Une URL file locale est décodée en chemin Unix, sans lire le fichier.
const fileUrl = DPath.normalize("file:///workspace/my%20file.ts");
// La valeur obtenue est /workspace/my file.ts ; le type ne déduit pas Absolute.
type _CheckFileUrl = DCommon.ExpectType<typeof fileUrl, (string & DPath.Path) | null, "strict">;

// Une chaîne vide désigne le chemin courant après normalisation.
const current = DPath.normalize("");
// La valeur obtenue est ".".
type _CheckCurrent = DCommon.ExpectType<typeof current, (string & DPath.Path) | null, "strict">;

// Un caractère nul ou une URL file distante ne peut pas être normalisé.
const rejected = DPath.normalize("file://remote-host/workspace/index.ts");
// La valeur obtenue est null.
type _CheckRejected = DCommon.ExpectType<typeof rejected, (string & DPath.Path) | null, "strict">;
