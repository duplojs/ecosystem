/**
 * @title Créer une route HTTP
 *
 * Une route se construit avec `useRouteBuilder` au travers d'une succession
 * de steps représentées par les méthodes du builder.
 *
 * Les steps sont exécutées dans leur ordre de déclaration, de haut en bas.
 * À l'exception de `handler`, elles peuvent être appelées autant de fois
 * que nécessaire et dans l'ordre souhaité.
 *
 * Les principales steps sont :
 * - `extract` : extrait et valide des données de la requête
 * - `cut` : exécute un bloc intermédiaire propre à la route
 * - `check` : interprète le résultat d'un checker
 * - `handler` : clôture la route
 *
 * Une route n'est enregistrée qu'une fois clôturée par `handler`.
 *
 * Les steps de vérification (`cut`, `check`, `presetCheck`, `exec`)
 * sont détaillées dans la partie routine.
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

// Les steps communiquent au travers du `floor`.
// Chaque step peut utiliser les données ajoutées par les steps précédentes
// et enrichir à son tour le `floor` pour les suivantes.
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

// Les `ResponseContract` déclarent les réponses HTTP qu'une step
// est autorisée à produire.
// Un contrat associe un statut HTTP, éventuellement une structure de body,
// et une `information`.
// L'`information` contextualise la réponse et, comme elle est littérale,
// permet également de la discriminer indépendamment de son statut
// ou de son body.
ResponseContract.ok("superResponse", DDataStructure.string());
ResponseContract.created("user.created", userStructure);
ResponseContract.noContent("user.deleted");
ResponseContract.conflict("email.alreadyUse");
ResponseContract.notFound("user.notfound");
ResponseContract.notFound("product.notfound");

// `extract` permet de récupérer et valider les différentes données
// de la requête avant de les ajouter au `floor`.
// L'extraction peut notamment cibler les paramètres de route,
// la query, les headers et le body.
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

// L'extraction peut se faire à deux profondeurs.
// Si une source utilise directement une `DataStructure`, sa valeur
// est ajoutée au `floor` sous le nom de la source.
// Ici, le body sera disponible dans `floor.body`.
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

// Si une source contient plusieurs `DataStructure`, chaque propriété
// extraite est ajoutée directement au `floor`.
// Ici, `page` et `search` seront disponibles dans
// `floor.page` et `floor.search`.
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

// Le format du body est contrôlé par le `bodyController` de la route.
// Le contrôleur par défaut traite un body JSON, mais il peut être remplacé
// lorsqu'un autre format doit être reçu, comme du `FormData`.
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
