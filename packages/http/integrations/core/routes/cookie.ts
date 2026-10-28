import { useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

useRouteBuilder("GET", "/cookie-check")
	.extract({
		cookies: {
			session: DDataStructure.string(),
		},
	})
	.handler(
		({ session }, { response }) => response.ok(
			"cookie.checked",
			{
				session,
			},
		).setCookie("refresh", "next-token", {
			httpOnly: true,
			path: "/",
			sameSite: "lax",
		}),
	);

useRouteBuilder("GET", "/cookie-drop")
	.handler(
		(__, { response }) => response.noContent("cookie.dropped").dropCookie("session"),
	);
