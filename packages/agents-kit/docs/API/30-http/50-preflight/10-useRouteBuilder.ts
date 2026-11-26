/**
 * @title PreflightBuilder.useRouteBuilder
 *
 * Créer plusieurs builders de routes à partir d'un preflight préparé.
 */
import { controlBodyAsText, usePreflightBuilder, useProcessBuilder } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const authentication = useProcessBuilder()
	.extract({
		headers: {
			authorization: DDataStructure.string(),
		},
	})
	.cut(
		({ authorization }, { output, response }) => {
			if (authorization !== "member") {
				return response.unauthorized("authentication.invalid");
			}

			return output({ user: { name: authorization } });
		},
	)
	.exports(["user"]);

const preflight = usePreflightBuilder()
	.exec(authentication, { imports: ["user"] });

const useAuthenticatedRouteBuilder = preflight.useRouteBuilder;

useAuthenticatedRouteBuilder("GET", ["/profile", "/account"])
	.handler(
		(floor, { response }) => {
			type _Floor = DCommon.ExpectType<
				typeof floor,
				{ user: { name: string } },
				"strict"
			>;

			return response.ok("profile.read", floor.user);
		},
	);

useAuthenticatedRouteBuilder("POST", "/profile/note", {
	bodyController: controlBodyAsText({ bodyMaxSize: "1mb" }),
})
	.extract({ body: DDataStructure.string() })
	.handler(
		({ user, body }, { response }) => response.ok("note.received", {
			user,
			body,
		}),
	);

// Chaque appel fournit une méthode et un chemin ou un tableau non vide de
// chemins. Le builder exécute les steps du preflight en premier. Les données
// importées par le preflight sont disponibles dans le floor de la route. Ici, un refus d'authentification
// empêche l'extraction et le handler de la route de s'exécuter.
//
// Les options locales acceptent hooks, metadata et bodyController. Les tableaux
// de hooks et metadata locaux précèdent ceux du preflight dans la définition.
// Le bodyController est choisi pour chaque route.
