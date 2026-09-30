/**
 * @title Faire une routine de vérification
 *
 * Certaines suites de vérifications doivent être exécutées à plusieurs endroits
 * avec le même enchaînement.
 *
 * Une authentification peut par exemple extraire un token, le vérifier,
 * retrouver l'utilisateur associé puis exposer cet utilisateur à la suite du flux.
 *
 * Un `process` permet d'isoler et de réutiliser ce type de séquence.
 */
import { type Checker, type CheckerFunctionOutput, type CheckerFunctionParams, ResponseContract, usePreflightBuilder, useProcessBuilder, useRouteBuilder } from "@duplojs/http";
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

declare const userExist: Checker<{
	theFunction(
		input: string & DString.Uuid,
		params: CheckerFunctionParams<undefined>,
	): DCommon.MaybePromise<
		| CheckerFunctionOutput<"user.find", {
			readonly email: string & DString.Email;
			readonly name: string;
			readonly id: string & DString.Uuid;
		}>
		| CheckerFunctionOutput<"user.notfound", null>
	>;
	options: undefined;
}>;

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
