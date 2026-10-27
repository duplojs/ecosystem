/**
 * @title Créer une route HTTP
 *
 * Définir les entrées d'une route, préparer les données du traitement et produire sa réponse HTTP.
 */
import { useRouteBuilder, controlBodyAsFormData, type RouteDeclarationToContract } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@duplojs/server/dataStructure";

const userStructure = DDataStructure.object({
	id: DDataStructure.string([DDataStructure.uuid()]),
	name: DDataStructure.string(),
	email: DDataStructure.string([DDataStructure.email()]),
});

type User = DDataStructure.StructureValue<typeof userStructure>;

declare function getUsers(params: {
	page: number;
	quantityPerPage: number;
}): Promise<User[]>;

// Une route est une suite de steps exécutées dans l'ordre.
// Elles partagent leurs données via le `floor`; `handler` clôture la route.
export const usersRoute = useRouteBuilder("GET", "/users")
	.extract({
		query: {
			page: DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.positive(),
			]),
			quantityPerPage: DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.greaterThanOrEqual(5),
				DDataStructure.lessThanOrEqual(20),
			]),
		},
	})
	.handler(
		async({ page, quantityPerPage }, { response }) => {
			const users = await getUsers({
				page,
				quantityPerPage,
			});

			return response.ok("users.findMany", users);
		},
	);

// `response.ok` construit une réponse 200 avec une information et un body.
// L'information identifie le résultat de l'opération, même lorsque plusieurs
// réponses partagent le même statut HTTP.
// Le type de la route reprend les réponses retournées par ses étapes :
// ici le résultat du handler et le refus d'extraction par défaut.
export type UsersRouteContract = RouteDeclarationToContract<typeof usersRoute>;

type _CheckResponses = DCommon.ExpectType<
	UsersRouteContract["responses"],
	| {
		readonly code: "200";
		readonly information: "users.findMany";
		readonly body: User[];
	}
	| {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body: Error;
	},
	"strict"
>;

// `extract` valide les entrées de requête avant de les ajouter au `floor`.
// Il peut cibler params, query, headers et body.
useRouteBuilder("POST", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.number([DDataStructure.positive()]),
		},
		query: {
			search: DDataStructure.string(),
		},
	})
	.extract({
		headers: {
			token: DDataStructure.string(),
		},
		body: DDataStructure.object({
			username: DDataStructure.string(),
			age: DDataStructure.number(),
		}),
	})
	.handler(
		(
			{
				userId,
				search,
				token,
				body,
			},
			{ response },
		) => {
			void userId;
			void search;
			void token;
			void body.username;
			void body.age;

			return response.noContent("user.received");
		},
	);

// Si une source utilise directement une `DataStructure`, elle garde son nom :
// le body sera disponible dans `floor.body`.
useRouteBuilder("POST", "/profile")
	.extract(
		{
			body: DDataStructure.object({
				name: DDataStructure.string(),
				age: DDataStructure.number(),
			}),
		},
		// Cette réponse locale remplace le refus d'extraction du Hub pour cette étape.
		({ response }) => response.badRequest("profile.invalid"),
	)
	.handler(
		({ body }, { response }) => {
			void body.name;
			void body.age;

			return response.noContent("profile.updated");
		},
	);

// Si une source contient plusieurs `DataStructure`, chaque propriété est
// ajoutée au `floor` : ici `floor.page` et `floor.search`.
useRouteBuilder("GET", "/search")
	.extract({
		query: {
			page: DDataStructure.number(),
			search: DDataStructure.string(),
		},
	})
	.handler(
		({ page, search }, { response }) => {
			void page;
			void search;

			return response.noContent("search.done");
		},
	);

// `bodyController` remplace le body JSON par défaut, par exemple pour recevoir
// du `FormData`.
useRouteBuilder(
	"POST",
	"/documents",
	{
		bodyController: controlBodyAsFormData({
			maxFileQuantity: 5,
		}),
	},
)
	.extract({
		body: {
			title: DDataStructure.string(),
			userId: DDataStructure.number(),
			files: DDataStructure.array(
				DSDataStructure.file(),
				[DDataStructure.maxElements(3)],
			),
		},
	})
	.handler(
		({ title, userId, files }, { response }) => {
			void title;
			void userId;
			void files;

			return response.noContent("documents.received");
		},
	);
