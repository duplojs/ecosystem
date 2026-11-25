/**
 * @title DSPath.normalize
 *
 * Normaliser un chemin selon le système courant dans la représentation DuploJS.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

// Hors Windows, utilise DPath.normalize ; le chemin n'est pas lu sur disque.
const relative = DSPath.normalize("src//module/../index.ts");
// Sur les deux plateformes, le résultat est "src/index.ts".
type _CheckRelative = DCommon.ExpectType<
	typeof relative,
	DPath.AnyPath | null,
	"strict"
>;

// Sur Windows, les séparateurs inverses deviennent des / et les lecteurs,
// partages et périphériques absolus occupent des espaces de noms virtuels :
// C:\foo -> /DRV-C:/foo ; \\serveur\partage\foo -> /UNC:/serveur/partage/foo ;
// \\.\pipe\nom -> /DEVICE:/pipe/nom. Les lettres de lecteur sont en majuscule.
// Les préfixes étendus \\?\C:\... et \\?\UNC\... sont ramenés à ces formes ;
// \\?\Volume{...} et \\?\GLOBALROOT deviennent /DEVICE:/.... Les segments
// de lecteur internes deviennent aussi DRV-X: ; C:relatif reste relatif.
const windowsInput = DSPath.normalize("C:\\work\\..\\file.txt");
// Windows : /DRV-C:/file.txt. Sur les autres systèmes, les \ restent littéraux.
type _CheckWindowsInput = DCommon.ExpectType<
	typeof windowsInput,
	DPath.AnyPath | null,
	"strict"
>;

// Sur Windows, les URL file:// sont décodées avant conversion :
// file:///C:/my%20file -> /DRV-C:/my file ;
// file://server/share/a -> /UNC:/server/share/a. Les séparateurs encodés sont
// décodés avant la résolution de .. ; la requête et le fragment sont ignorés.
// Un chemin absolu sans lecteur utilise celui du dossier courant, y compris si
// .. a retiré l'espace de noms. Sans lecteur courant, le résultat est null.
const fileUrl = DSPath.normalize("file:///C:/my%20file.txt");
// Windows : /DRV-C:/my file.txt. Le résultat dépend du système courant.
type _CheckFileUrl = DCommon.ExpectType<
	typeof fileUrl,
	DPath.AnyPath | null,
	"strict"
>;

