/**
 * @title Faire une routine de vérification
 *
 * Une vérification est une step qui décide si le flux peut continuer
 * ou s'arrêter avec une réponse.
 *
 * Elle peut rester locale au flux avec `cut`, être isolée dans un `checker`,
 * puis être enchaînée avec d'autres steps dans un `process`.
 *
 * Le choix dépend de la nature de l'opération, pas du nombre actuel d'appels.
 * Une opération clairement réutilisable doit être isolée dans un checker,
 * même si elle n'est utilisée qu'une fois aujourd'hui. C'est notamment le cas
 * d'une recherche par identifiant, avec des informations génériques comme
 * `user.find` et `user.notfound`.
 *
 * - `cut` garde les vérifications propres à l'action ou au use case du flux
 * - `checker` encapsule une opération réutilisable et ses résultats identifiés
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

declare function findOneUser(id: string & DString.Uuid): Promise<DEither.Maybe<User>>;

// Un checker encapsule une opération clairement réutilisable, même lorsque
// son premier usage est unique. La récupération de la donnée fait entièrement
// partie du checker : ses appelants lui fournissent seulement l'identifiant.
//
// Les informations décrivent le résultat générique de l'opération.
// Le checker ne choisit ni le résultat attendu par une route, ni sa réponse HTTP :
// cette interprétation appartient à `check` ou à un preset.
export const userExist = useCheckerBuilder()
	.handler(
		async(input: string & DString.Uuid, { output }) => {
			const result = await findOneUser(input);

			return DEither.matchInformation(result, {
				some: (user) => output("user.find", user),
				none: () => output("user.notfound", null),
			});
		},
	);

// `cut` couvre les vérifications propres à une route, à un process ou au use case
// appelé ensuite. Ici, la comparaison de l'email concerne la confirmation demandée,
// tandis que la recherche générique de l'utilisateur reste dans `userExist`.
//
// La callback peut soit interrompre le flux avec `response`,
// soit le poursuivre avec `output`.
// Les données retournées par `output` enrichissent alors le `floor`
// des steps suivantes.
useRouteBuilder("POST", "/users/{userId}/confirm-email")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
		},
		body: {
			email: DDataStructure.string([DDataStructure.email()]),
		},
	})
	.check(
		userExist,
		{
			input: ({ userId }) => userId,
			result: "user.find",
			otherwise: ResponseContract.notFound("user.notfound"),
			indexing: "user",
		},
	)
	.cut(
		// Cette information décrit un échec propre à la confirmation d'email.
		ResponseContract.conflict("user.emailConfirmation.mismatch"),
		({ user, email }, { response, output }) => {
			if (user.email !== email) {
				// Interrompt immédiatement l'exécution du flux.
				return response("user.emailConfirmation.mismatch");
			}

			// Poursuit le flux et ajoute la donnée vérifiée au `floor`.
			return output({ confirmedUser: user });
		},
	)
	.handler(
		ResponseContract.ok("user.emailConfirmed", userStructure),
		({ confirmedUser }, { response }) => response("user.emailConfirmed", confirmedUser),
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
// Il associe ici le résultat générique `user.notfound` à une réponse HTTP 404.
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
