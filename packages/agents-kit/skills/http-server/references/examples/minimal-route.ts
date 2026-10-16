/**
 * @title Valider une entrée et répondre sans dépendance applicative.
 *
 * Cette route autonome sert au démarrage minimal du serveur.
 */
import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const helloRoute = useRouteBuilder("GET", "/hello")
	.extract({
		query: {
			name: DDataStructure.string([DDataStructure.minCharacters(1)]),
		},
	})
	.handler(
		ResponseContract.ok("hello.received", DDataStructure.string()),
		({ name }, { response }) => response("hello.received", name),
	);
