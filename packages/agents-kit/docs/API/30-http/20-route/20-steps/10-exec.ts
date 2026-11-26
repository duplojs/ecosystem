/**
 * @title RouteBuilder.exec
 *
 * Exécuter un process réutilisable dans une route.
 */
import { useProcessBuilder, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const authentication = useProcessBuilder()
	.extract({
		headers: {
			authorization: DDataStructure.string(),
		},
	})
	.cut(
		({ authorization }, { response, output }) => authorization === "valid"
			? output({ identity: "member" })
			: response.unauthorized("token.invalid"),
	)
	.exports(["identity"]);

useRouteBuilder("GET", "/account")
	.exec(
		authentication,
		{ imports: ["identity"] },
	)
	.handler(
		({ identity }, { response }) => response.ok("account.allowed", { identity }),
	);

// Le process possède son floor local. Les imports sélectionnent les données
// exportées à ajouter à celui de la route ; sans imports, rien n'est ajouté.
// Une réponse du process interrompt la route. Les options peuvent être fournies
// directement ou calculées depuis le floor de la route.
