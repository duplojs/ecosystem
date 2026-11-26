/**
 * @title RouteBuilder.handler
 *
 * Terminer la construction d'une route par une réponse HTTP.
 */
import { useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";

const route = useRouteBuilder("GET", "/items/{id}")
	.extract({
		params: {
			id: DDataStructure.number(),
		},
	})
	.handler(
		({ id }, { request, response }) => {
			// La requête reste accessible, ainsi que les données validées du floor.
			const result = response.ok("item.found", {
				id,
				path: request.path,
			});

			type checkCode = DCommon.ExpectType<typeof result.code, "200", "strict">;
			type checkInformation = DCommon.ExpectType<typeof result.information, "item.found", "strict">;

			return result;
		},
	);

// response.ok exige un body ; response.created et response.badRequest en
// acceptent un facultativement ; response.noContent n'en accepte pas.
// Chaque helper fixe le code HTTP et reçoit une information identifiant le
// résultat. Les réponses des steps et du handler contribuent au type de route.
// Le handler peut être asynchrone. Il crée la route et l'ajoute normalement au
// routeStore, sans l'enregistrer dans un Hub.
