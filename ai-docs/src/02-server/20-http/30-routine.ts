/**
 * @title Faire une routine de vérification
 *
 * Une vérification est une step qui décide si le flux peut continuer
 * ou s'arrêter avec une réponse.
 *
 * Elle peut rester locale au flux avec `cut`, être isolée dans un `checker`,
 * puis être enchaînée avec d'autres steps dans un `process`.
 *
 * Les formes changent selon ce qui doit être réutilisé :
 * - `cut` garde la vérification dans le flux courant
 * - `checker` isole la logique de vérification
 * - `presetCheck` réutilise la manière d'interpréter un checker
 * - `process` réutilise une séquence complète de steps
 */
import { ResponseContract, createPresetChecker, useCheckerBuilder, usePreflightBuilder, useProcessBuilder, useRouteBuilder } from "@duplojs/http";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DObject from "@duplojs/lang/object";
import type * as DString from "@duplojs/lang/string";

const userStructure = DDataStructure.object({
	id: DDataStructure.string([DDataStructure.uuid()]),
	name: DDataStructure.string(),
	email: DDataStructure.string([DDataStructure.email()]),
});

type User = DDataStructure.StructureValue<typeof userStructure>;

declare function checkToken(
	token: string,
): DEither.Success<User> | DEither.Fail;

declare function findOneUser(id: string & DString.Uuid): Promise<User | undefined>;

// `cut` couvre les vérifications propres à une route ou à un process,
// lorsque le traitement ne mérite pas encore d'être nommé comme checker.
//
// La callback peut soit interrompre le flux avec `response`,
// soit le poursuivre avec `output`.
// Les données retournées par `output` enrichissent alors le `floor`
// des steps suivantes.
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
				// Interrompt immédiatement l'exécution du flux.
				return response("user.inaccessible");
			}

			const user = await findOneUser(userId);

			if (!user) {
				return response("user.notfound");
			}

			// Poursuit le flux et ajoute `user` au `floor`.
			return output({ user });
		},
	)
	.handler(
		ResponseContract.ok("user.find", userStructure),
		({ user }, { response }) => response("user.find", user),
	);

// Un checker factorise une vérification indépendante du flux qui l'utilise.
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

// `check` interprète les résultats d'un checker dans le contexte du flux.
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

			// Ce résultat permet de poursuivre l'exécution du flux.
			result: "user.find",

			// Les autres résultats interrompent le flux avec un `ResponseContract`.
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
// Les éléments dépendants du contexte du flux restent définis localement.
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

// Certaines suites de vérifications doivent être exécutées à plusieurs endroits
// avec le même enchaînement.
//
// Une authentification peut par exemple extraire un token, le vérifier,
// retrouver l'utilisateur associé puis exposer cet utilisateur à la suite du flux.
//
// Un `process` permet d'isoler et de réutiliser ce type de séquence.

// Un `process` est une succession de steps isolée du contexte d'une route.
//
// Comme une route, ses steps communiquent au travers d'un `floor`.
// Ce `floor` reste local au process : seules les données explicitement
// déclarées avec `exports` pourront être récupérées par son appelant.
export const authenticationProcess = useProcessBuilder()
	.extract({
		headers: {
			authorization: DDataStructure.string(),
		},
	})
	.cut(
		ResponseContract.unauthorized("token.invalid"),
		({ authorization }, { response, output }) => DCommon.pipe(
			authorization,
			checkToken,
			DEither.whenIsRight(
				(user) => output({
					authenticatedUserId: user.id,
				}),
			),
			DEither.whenIsLeft(
				() => response("token.invalid"),
			),
		),
	)
	.check(
		userExist,
		{
			input: DObject.getProperty("authenticatedUserId"),
			result: "user.find",
			otherwise: ResponseContract.notFound("token.user.notfound"),
			indexing: "user",
		},
	)
	// Seules ces données pourront sortir du `floor` du process.
	.exports(["user"]);

// `exec` insère l'exécution du process dans le flux courant.
useRouteBuilder("GET", "/some-action")
	.exec(
		authenticationProcess,
		{
			// sélectionne parmi les données exportées celles qui doivent
			// être ajoutées au `floor` de la route.
			imports: ["user"],
		},
	)
	.handler(
		ResponseContract.ok("some-information.send", userStructure),
		({ user }, { response }) => response(
			"some-information.send",
			user,
		),
	);

// Lorsqu'un même process doit précéder de nombreuses routes,
// il peut être intégré à un preflight.
//
// Le builder obtenu conserve alors ce préambule et les données
// qu'il ajoute au `floor`.
export const useAuthenticatedRouteBuilder = usePreflightBuilder()
	.exec(
		authenticationProcess,
		{
			imports: ["user"],
		},
	)
	.useRouteBuilder;

useAuthenticatedRouteBuilder("GET", "/some-action")
	.handler(
		ResponseContract.ok("some-information.send", userStructure),
		({ user }, { response }) => response(
			"some-information.send",
			user,
		),
	);
