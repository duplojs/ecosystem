/**
 * @title Créer une route HTTP
 *
 * Construction avec `useRouteBuilder` : steps, `floor`, extraction, réponse contextualisée et `handler`.
 */
import { ResponseContract, useRouteBuilder, controlBodyAsFormData } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DServerDataStructure from "@duplojs/server/dataStructure";

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
useRouteBuilder("GET", "/users")
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
		ResponseContract.ok("users.findMany", DDataStructure.array(userStructure)),
		async({ page, quantityPerPage }, { response }) => {
			const users = await getUsers({
				page,
				quantityPerPage,
			});

			return response("users.findMany", users);
		},
	);

// Un `ResponseContract` associe un statut HTTP, un body éventuel et une
// `information` littérale.
//
// L'information contextualise la réponse et sert de discriminant principal.
// Le statut HTTP garde son rôle de convention protocolaire, mais c'est
// l'information qui identifie finement le résultat du flux, y compris lorsqu'une
// réponse n'a pas besoin de body.
ResponseContract.ok("superResponse", DDataStructure.string());
ResponseContract.created("user.created", userStructure);
ResponseContract.noContent("user.deleted");
ResponseContract.conflict("email.alreadyUse");
ResponseContract.notFound("user.notfound");
ResponseContract.notFound("product.notfound");

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
		ResponseContract.noContent("user.received"),
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

			return response("user.received");
		},
	);

// Si une source utilise directement une `DataStructure`, elle garde son nom :
// le body sera disponible dans `floor.body`.
useRouteBuilder("POST", "/profile")
	.extract({
		body: DDataStructure.object({
			name: DDataStructure.string(),
			age: DDataStructure.number(),
		}),
	})
	.handler(
		ResponseContract.noContent("profile.updated"),
		({ body }, { response }) => {
			void body.name;
			void body.age;

			return response("profile.updated");
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
		ResponseContract.noContent("search.done"),
		({ page, search }, { response }) => {
			void page;
			void search;

			return response("search.done");
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
				DServerDataStructure.file(),
				[DDataStructure.maxElements(3)],
			),
		},
	})
	.handler(
		ResponseContract.noContent("documents.received"),
		({ title, userId, files }, { response }) => {
			void title;
			void userId;
			void files;

			return response("documents.received");
		},
	);
