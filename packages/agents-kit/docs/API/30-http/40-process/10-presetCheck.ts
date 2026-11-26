/**
 * @title ProcessBuilder.presetCheck
 *
 * Appliquer une interprétation de checker partagée dans un process.
 */
import { useProcessBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { requireUser } from "../30-checker/10-createPresetChecker";

export const userFromRequest = useProcessBuilder()
	.extract({ params: { id: DDataStructure.string() } })
	.presetCheck(
		requireUser.indexing("user"),
		({ id }) => id,
	)
	.exports(["user"]);

// La callback construit l'entrée depuis le floor local. Le preset détermine
// les résultats acceptés et le refus ; son indexing ajoute la valeur retenue
// au floor du process. Sans indexing, aucune valeur n'est ajoutée. La réponse
// de refus interrompt la séquence. Des metadata peuvent suivre la callback.
