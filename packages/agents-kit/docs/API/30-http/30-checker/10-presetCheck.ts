/**
 * @title RouteBuilder.presetCheck
 *
 * Appliquer dans une route l'interprétation partagée par un preset.
 */
import { useRouteBuilder } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { requireUser, requireUserFromSession } from "./10-createPresetChecker";

// Le preset fixe résultat, refus et options éventuelles ; la route fournit
// son entrée depuis le floor. Les metadata peuvent suivre cette callback.
useRouteBuilder("GET", "/profiles/{id}")
	.extract({ params: { id: DDataStructure.string() } })
	.presetCheck(
		requireUser.indexing("profile"),
		({ id }) => id,
	)
	.handler(
		({ profile }, { response }) => response.ok("profile.found", profile),
	);

// La même interprétation reçoit ici un objet session. rewriteInput en extrait
// l'identifiant avant l'appel du checker ; l'indexation et les options sont
// celles du preset reconfiguré. Un résultat refusé utilise son otherwise et
// interrompt la route ; sa réponse est incluse dans le contrat de la route.
useRouteBuilder("GET", "/sessions/{userId}")
	.extract({ params: { userId: DDataStructure.string() } })
	.presetCheck(
		requireUserFromSession,
		({ userId }) => ({ userId }),
	)
	.handler(
		({ user }, { response }) => {
			type _User = DCommon.ExpectType<
				typeof user,
				{
					id: string;
					active: boolean;
				},
				"strict"
			>;

			return response.ok("session.user", user);
		},
	);

// Sans indexing, aucune valeur n'est ajoutée au floor.
