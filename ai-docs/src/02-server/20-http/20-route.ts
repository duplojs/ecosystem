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
 * - `cut` : exécute un bloc intermédiaire puis poursuit la route
 * - `check` : exécute un checker
 * - `handler` : clôture la route
 *
 * Une route n'est enregistrée qu'une fois clôturée par `handler`.
 */
import { ResponseContract, useRouteBuilder, controlBodyAsFormData, useCheckerBuilder, createPresetChecker } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";
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
		({ title, userId }, { response }) => {
			void title;
			void userId;

			return response("documents.received");
		},
	);

declare function findOneUser(id: string & DString.Uuid): Promise<User | undefined>;

// Un checker factorise une opération indépendante de la route qui l'utilise.
// Il reçoit un input et produit l'un de plusieurs résultats identifiés.
//
// Le checker ne définit pas lui-même lequel de ses résultats représente
// un succès ou une erreur. Ce sens est donné au moment de son utilisation.
export const userExist = useCheckerBuilder()
	.handler(
		async(input: string & DString.Uuid, { output }) => {
			const user = await findOneUser(input);

			if (user) {
				return output("user.find", user);
			}

			return output("user.notfound", null);
		},
	);

// `check` interprète les résultats d'un checker dans le contexte de la route.
//
// Cette interprétation détermine le résultat qui permet de poursuivre,
// le traitement des autres résultats et éventuellement la donnée ajoutée au `floor`.
useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
		},
	})
	.check(
		userExist,
		{
			// Construit l'input du checker depuis le `floor`.
			input: ({ userId }) => userId,

			// Ce résultat permet de poursuivre l'exécution de la route.
			result: "user.find",

			// Les autres résultats interrompent la route avec un `ResponseContract`.
			otherwise: ResponseContract.notFound("user.notfound"),

			// La valeur produite par `result` est ajoutée au `floor`.
			indexing: "user",
		},
	)
	.handler(
		ResponseContract.ok("user.find", userStructure),
		({ user }, { response }) => response("user.find", user),
	);

// Un même checker peut donc être interprété différemment selon son utilisation.
// Un preset permet de nommer et réutiliser une interprétation récurrente.
export const iWantUserExist = createPresetChecker(
	userExist,
	{
		result: "user.find",
		otherwise: ResponseContract.notFound("user.notfound"),
	},
);

// `presetCheck` applique cette interprétation.
// Les éléments dépendants du contexte de la route restent définis localement.
useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
		},
	})
	.presetCheck(
		// L'indexation peut être définie ou remplacée localement.
		iWantUserExist.indexing("user"),
		({ userId }) => userId,
	)
	.handler(
		ResponseContract.ok("user.find", userStructure),
		({ user }, { response }) => response("user.find", user),
	);

// `cut` couvre les traitements intermédiaires spécifiques à une route
// qui ne justifient pas la création d'un checker.
//
// La callback peut soit interrompre la route avec `response`,
// soit poursuivre son exécution avec `output`.
// Les données retournées par `output` enrichissent alors le `floor`.
useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
		},
	})
	.cut(
		[
			// Déclare les réponses que cette step peut produire.
			ResponseContract.notFound("user.notfound"),
			ResponseContract.forbidden("user.inaccessible"),
		],
		async({ userId }, { response, output }) => {
			if (userId === "") {
				// Interrompt immédiatement l'exécution de la route.
				return response("user.inaccessible");
			}

			const user = await findOneUser(userId);

			if (!user) {
				return response("user.notfound");
			}

			// Poursuit la route et ajoute `user` au `floor`.
			return output({ user });
		},
	)
	.handler(
		ResponseContract.ok("user.find", userStructure),
		({ user }, { response }) => response("user.find", user),
	);
