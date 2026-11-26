/**
 * @title ProcessBuilder.exports
 *
 * Finaliser un process et choisir les données que ses appelants peuvent importer.
 */
import { useProcessBuilder, type GetProcessExportValue } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const requestIdentity = useProcessBuilder()
	.extract({ headers: { authorization: DDataStructure.string() } })
	.cut(
		({ authorization }, { output }) => output({ identity: authorization }),
	)
	.exports(["identity"]);

type _Available = DCommon.ExpectType<
	GetProcessExportValue<typeof requestIdentity>,
	{ identity: string },
	"strict"
>;

// authorization est disponible dans le cut, mais ne fait pas partie du type
// exporté. Les clés sélectionnées doivent exister dans le floor à la fin du
// builder, y compris les options ou les valeurs importées d'un process interne.
// exports() et exports([]) finalisent sans clé importable. Les steps continuent
// néanmoins à s'exécuter et peuvent interrompre le flux par une réponse.
//
// exports définit les clés importables dans le type ; il ne copie ni ne filtre
// les valeurs à l'exécution. Lors de exec, imports copie les clés choisies du
// floor du process vers celui de l'appelant.
