/**
 * @title DPath.normalize
 *
 * Réduire les séparateurs et les segments relatifs d’un chemin.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const result = DPath.normalize("src//module/../index.ts");
// La valeur obtenue est src/index.ts ; null signale une entrée invalide.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	(string & (DPath.Path | DPath.Absolute | DPath.Segment)) | null,
	"strict"
>;

// Une URL file:// est décodée en chemin : l'hôte est conservé, la requête et
// le fragment sont ignorés. localhost correspond à un hôte vide.
const fileUrl = DPath.normalize("file:///workspace/my%20file.ts");
// La valeur obtenue est /workspace/my file.ts ; le type ne déduit pas Absolute.
type _CheckFileUrl = DCommon.ExpectType<
	typeof fileUrl,
	(string & (DPath.Path | DPath.Absolute | DPath.Segment)) | null,
	"strict"
>;

// Les séparateurs encodés sont décodés avant la réduction des segments.
const remoteFileUrl = DPath.normalize("file://remote-host/a%2F..%2Ffile.txt?ignored#fragment");
// Le résultat est /remote-host/file.txt : .. est résolu après décodage.
type _CheckRemoteFileUrl = DCommon.ExpectType<
	typeof remoteFileUrl,
	(string & (DPath.Path | DPath.Absolute | DPath.Segment)) | null,
	"strict"
>;

// Les chemins de ce domaine utilisent / comme séparateur, quel que soit le
// système ; une barre inverse reste un caractère du chemin. Pour interpréter
// un chemin natif Windows, utiliser DSPath.normalize depuis @duplojs/server/path.
