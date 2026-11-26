/**
 * @title ProcessBuilder.check
 *
 * Interpréter un checker dans une séquence et enrichir son floor local.
 */
import { useProcessBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { userChecker } from "../30-checker/10-useCheckerBuilder";

export const verifiedUser = useProcessBuilder()
	.extract({ params: { id: DDataStructure.string() } })
	.check(
		userChecker,
		{
			input: ({ id }) => id,
			result: "user.found",
			indexing: "user",
			otherwise: ({ response }) => response.notFound("user.unavailable"),
		},
	)
	.cut(
		({ user }, { output }) => output({ userId: user.id }),
	)
	.exports(["userId"]);

// input est construit depuis le floor local. Le résultat accepté est placé sous
// indexing ; sans indexing, il n'ajoute rien. Les autres résultats passent à
// otherwise, dont la réponse interrompt aussi le flux appelant. user reste ici
// interne ; userId seul est exporté. Les options et metadata suivent les
// mêmes règles que pour check dans une route.
