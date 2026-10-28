/**
 * @title Consommer les garanties d'un processus d'authentification.
 *
 * Comparer son application commune par preflight et son exécution locale.
 */
import { useRouteBuilder } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import { authenticationProcess, useAuthenticatedRouteBuilder } from "./authentication";
import { type User } from "./contracts";

export const profileRoute = useAuthenticatedRouteBuilder("GET", "/profile")
	.handler(
		(floor, { response }) => {
			type _CheckFloor = DCommon.ExpectType<
				typeof floor,
				{ user: User },
				"strict"
			>;

			return response.ok("profile.read", floor.user);
		},
	);

// Alternative lorsque le processus est propre à cette route.
export const explicitAuthenticationRoute = useRouteBuilder("GET", "/session")
	.exec(authenticationProcess, { imports: ["user"] })
	.handler(
		({ user }, { response }) => response.ok("session.read", user),
	);
