/**
 * @title Faire une routine de vérification
 *
 * Vérifications dans les flux HTTP, réutilisation des traitements et adaptation de leurs résultats au contexte.
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

// Un checker encapsule une opération réutilisable et produit des résultats
// génériques. Il ne choisit pas leur sens HTTP.
//
// Ce sens est donné au point d'utilisation : une route peut interpréter le
// checker avec `check`, ou une interprétation récurrente peut être nommée
// avec un preset. Le même checker peut donc servir plusieurs flux sans être
// dupliqué pour chaque variation d'usage.
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

// `cut` couvre les vérifications propres au flux courant.
// Il peut interrompre avec `response` ou poursuivre avec `output`.
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
		ResponseContract.conflict("user.emailConfirmation.mismatch"),
		({ user, email }, { response, output }) => {
			if (user.email !== email) {
				return response("user.emailConfirmation.mismatch");
			}

			return output({ confirmedUser: user });
		},
	)
	.handler(
		ResponseContract.ok("user.emailConfirmed", userStructure),
		({ confirmedUser }, { response }) => response("user.emailConfirmed", confirmedUser),
	);

// `check` interprète un checker pour un flux donné : input, résultat attendu,
// réponse sinon, et donnée ajoutée au `floor`.
useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
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
	.handler(
		ResponseContract.ok("user.find", userStructure),
		({ user }, { response }) => response("user.find", user),
	);

// Un preset nomme une interprétation récurrente du checker.
// Il fixe le sens habituel du résultat tout en laissant le flux fournir
// son input et son indexation locale.
export const iWantUserExist = createPresetChecker(
	userExist,
	{
		result: "user.find",
		otherwise: ResponseContract.notFound("user.notfound"),
	},
);

// `presetCheck` applique le preset au flux courant.
useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DDataStructure.string([DDataStructure.uuid()]),
		},
	})
	.presetCheck(
		iWantUserExist.indexing("user"),
		({ userId }) => userId,
	)
	.handler(
		ResponseContract.ok("user.find", userStructure),
		({ user }, { response }) => response("user.find", user),
	);

// Un `process` réutilise une séquence complète de steps.
// Son `floor` reste local : seules les données déclarées avec `exports` sortent.
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
			DEither.whenIsRightOtherwise(
				(user) => output({
					authenticatedUserId: user.id,
				}),
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
	.exports(["user"]);

// `exec` insère l'exécution du process dans le flux courant.
useRouteBuilder("GET", "/some-action")
	.exec(
		authenticationProcess,
		{
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

// Un preflight préfixe un builder par un process récurrent.
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
