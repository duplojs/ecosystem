/**
 * @title RouteBuilder.cut
 *
 * Poursuivre une route avec des données supplémentaires ou répondre immédiatement.
 */
import { useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";

declare function findUser(id: number): Promise<{ name: string } | undefined>;

useRouteBuilder("GET", "/users/{id}")
	.extract({
		params: {
			id: DDataStructure.number(),
		},
	})
	.cut(
		async({ id }, { output, response, request }) => {
			const user = await findUser(id);

			if (!user) {
				return response.notFound("user.notfound", { path: request.path });
			}

			// output fusionne ses propriétés au floor ; output() poursuit sans ajout.
			return output({ user });
		},
	)
	.handler(
		({ id, user }, { response }) => {
			type checkUser = DCommon.ExpectType<typeof user, { name: string }, "strict">;

			return response.ok("user.found", {
				id,
				user,
			});
		},
	);

// Une réponse interrompt le flux et contribue aux réponses possibles de la
// route ; seules les branches output alimentent le floor des steps suivantes.
// cut reçoit request et les helpers de refus (4xx et internalServerError).
