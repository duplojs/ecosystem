/**
 * @title ProcessBuilder.cut
 *
 * Préparer des données locales ou interrompre une séquence réutilisable.
 */
import { useProcessBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

declare function findAccount(id: string): Promise<{
	id: string;
	active: boolean;
} | undefined>;

export const activeAccount = useProcessBuilder()
	.extract({ params: { id: DDataStructure.string() } })
	.cut(
		async({ id }, { output, response }) => {
			const account = await findAccount(id);

			if (!account) {
				return response.notFound("account.missing");
			}

			return output({ account });
		},
	)
	.cut(
		({ account }, { output, response }) => {
			if (!account.active) {
				return response.forbidden("account.inactive");
			}

			return output({ accountId: account.id });
		},
	)
	.exports(["accountId"]);

// output fusionne ses propriétés au floor local ; output() continue sans ajout.
// account sert au second cut sans être exporté. Une réponse arrête la séquence
// et remonte au flux appelant, indépendamment des exports. Les exceptions JS ne
// sont pas des réponses HTTP prévues.
