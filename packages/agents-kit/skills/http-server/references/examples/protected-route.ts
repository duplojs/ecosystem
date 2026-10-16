/**
 * @title Consommer les garanties d'un processus d'authentification.
 *
 * Comparer son application commune par preflight et son exécution locale.
 */
import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import { authenticationProcess, useAuthenticatedRouteBuilder } from "./authentication";
import { userStructure, type User } from "./contracts";

export const profileRoute = useAuthenticatedRouteBuilder("GET", "/profile")
	.handler(
		ResponseContract.ok("profile.read", userStructure),
		(floor, { response }) => {
			type _CheckFloor = DCommon.ExpectType<
				typeof floor,
				{ user: User },
				"strict"
			>;

			return response("profile.read", floor.user);
		},
	);

// Alternative lorsque le processus est propre à cette route.
export const explicitAuthenticationRoute = useRouteBuilder("GET", "/session")
	.exec(authenticationProcess, { imports: ["user"] })
	.handler(
		ResponseContract.ok("session.read", userStructure),
		({ user }, { response }) => response("session.read", user),
	);
