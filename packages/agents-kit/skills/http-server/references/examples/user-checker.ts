/**
 * @title Séparer une recherche réutilisable et son interprétation HTTP.
 *
 * Un preset fixe le résultat attendu et la réponse d'absence du checker.
 */
import { createPresetChecker, useCheckerBuilder } from "@duplojs/http";
import * as DEither from "@duplojs/lang/either";
import { type User } from "./contracts";

// Capacité fournie par l'application ; son absence reste un résultat typé.
declare function findUser(id: User["id"]): Promise<DEither.Maybe<User>>;

export const userExist = useCheckerBuilder()
	.handler(async(id: User["id"], { output }) => {
		const result = await findUser(id);

		return DEither.matchInformation(result, {
			some: (user) => output("user.found", user),
			none: () => output("user.notFound", null),
		});
	});

export const iWantUserExist = createPresetChecker(userExist, {
	result: "user.found",
	otherwise: ({ response }) => response.notFound("user.notFound"),
});
