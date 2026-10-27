/**
 * @title Équiper une famille de routes d'un processus commun.
 *
 * Le preflight exporte une fonction qui crée des routes avec authentification.
 */
import { useCheckerBuilder, usePreflightBuilder, useProcessBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { type User } from "./contracts";

// La politique de vérification est fournie par l'application.
declare function authenticateToken(token: string): Promise<DEither.Success<User> | DEither.Fail>;

const tokenChecker = useCheckerBuilder()
	.handler(async(token: string, { output }) => {
		const result = await authenticateToken(token);

		return DEither.whenIsRightOtherwise(
			result,
			(user) => output("token.valid", user),
			() => output("token.invalid", null),
		);
	});

export const authenticationProcess = useProcessBuilder()
	.extract({
		headers: {
			authorization: DDataStructure.string(),
		},
	})
	.check(tokenChecker, {
		input: ({ authorization }) => authorization,
		result: "token.valid",
		otherwise: ({ response }) => response.unauthorized("authentication.invalid"),
		indexing: "user",
	})
	// authorization reste interne au process ; seul user est exposé.
	.exports(["user"]);

export const useAuthenticatedRouteBuilder = usePreflightBuilder()
	.exec(authenticationProcess, { imports: ["user"] })
	.useRouteBuilder;
