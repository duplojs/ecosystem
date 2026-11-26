/**
 * @title ProcessBuilder.extract
 *
 * Valider des données de requête et enrichir le floor local du process.
 */
import { useProcessBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const articleInput = useProcessBuilder()
	.extract(
		{
			params: { id: DDataStructure.string() },
			query: DDataStructure.object({ preview: DDataStructure.boolean() }),
		},
		({ response }) => response.badRequest("article.invalid"),
	)
	.cut(
		({ id, query }, { output }) => output({
			articleRequest: {
				id,
				preview: query.preview,
			},
		}),
	)
	.exports(["articleRequest"]);

// Les sources params, query, headers et body utilisent des DataStructures.
// Une structure unique conserve la clé de la source ; un objet de structures
// ajoute ses propriétés directement au floor. Ici id et query servent au cut,
// mais seul articleRequest est exposé au flux appelant.
// Un échec appelle otherwise, ou le refus par défaut du Hub si absent ; sa
// réponse arrête le process et le flux appelant.
