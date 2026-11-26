/**
 * @title RouteBuilder.extract
 *
 * Valider les sources de la requête et ajouter leurs valeurs au floor.
 */
import { useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";

// params ne peut nommer que des paramètres présents dans les chemins déclarés.
// Une structure par propriété ajoute chaque résultat directement sous sa clé.
useRouteBuilder("POST", "/users/{id}")
	.extract({
		params: {
			id: DDataStructure.number(),
		},
		query: {
			page: DDataStructure.number(),
		},
		headers: {
			authorization: DDataStructure.string(),
		},
		body: DDataStructure.object({
			name: DDataStructure.string(),
		}),
	})
	.handler(
		({ id, page, authorization, body }, { response }) => {
			type checkFloor = DCommon.ExpectType<
				{
					id: typeof id;
					page: typeof page;
					authorization: typeof authorization;
					body: typeof body;
				},
				{
					id: number;
					page: number;
					authorization: string;
					body: { readonly name: string };
				},
				"strict"
			>;

			return response.ok("user.received", {
				id,
				page,
				authorization,
				name: body.name,
			});
		},
	);

// Une structure unique est placée sous le nom de sa source : ici floor.query.
// Un objet de structures est aplati : ici floor.title et floor.content.
useRouteBuilder("POST", "/articles")
	.extract(
		{
			query: DDataStructure.object({
				draft: DDataStructure.boolean(),
			}),
			body: {
				title: DDataStructure.string(),
				content: DDataStructure.string(),
			},
		},
		({ response, floor, dataStructureError }) => response.badRequest(
			"article.invalid",
			{
				floor,
				message: dataStructureError.message,
			},
		),
	)
	.handler(
		({ query, title, content }, { response }) => response.created(
			"article.received",
			{
				draft: query.draft,
				title,
				content,
			},
		),
	);

// Les sources et propriétés sont validées successivement ; en cas d'échec,
// otherwise reçoit le floor déjà construit et arrête la route. Sa réponse
// contribue au type de la route. Sans callback locale, le Hub utilise son refus
// par défaut : 422 / extract-error. L'en-tête extract-key identifie la source.
// Les codecs des sources hors body sont configurés par le Hub ; ceux du body
// proviennent du lecteur.
