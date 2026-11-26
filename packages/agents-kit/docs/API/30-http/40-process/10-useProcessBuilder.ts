/**
 * @title useProcessBuilder
 *
 * Définir une séquence de steps réutilisable et ses options par défaut.
 */
import { useProcessBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Un process assemble des steps et peut répondre sans déclarer de méthode ni
// de chemin. Un checker produit des résultats que le flux doit interpréter.
export const accessProcess = useProcessBuilder({
	options: { allowGuest: false },
})
	.extract({ headers: { authorization: DDataStructure.string() } })
	.cut(
		({ authorization, options }, { output, response }) => {
			if (authorization !== "member" && !options.allowGuest) {
				return response.unauthorized("access.denied");
			}

			return output({ identity: authorization });
		},
	)
	.exports(["identity"]);

// options définit la configuration par défaut et son type ; elle est accessible
// dans le floor local sous options. Elle peut être remplacée à chaque exec.
// Sans options déclarées,
// options n'est pas exposée dans le type du floor. Les données de la requête
// sont obtenues séparément par les steps, notamment extract.
//
// hooks accepte des hooks de cycle de vie associés au process et à ses steps ;
// metadata reçoit les metadata de sa définition, pour les mécanismes qui les
// exploitent. Ces deux tableaux sont vides par défaut. Les metadata ne sont pas
// des données du floor. Les méthodes de step acceptent aussi des metadata.
