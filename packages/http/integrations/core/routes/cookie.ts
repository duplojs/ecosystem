import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

useRouteBuilder("GET", "/cookie-check")
	.extract({
		cookies: {
			session: DDataStructure.string(),
		},
	})
	.handler(
		ResponseContract.ok(
			"cookie.checked",
			DDataStructure.object({
				session: DDataStructure.string(),
			}),
		),
		({ session }, { response }) => response(
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
		ResponseContract.noContent("cookie.dropped"),
		(__, { response }) => response("cookie.dropped").dropCookie("session"),
	);
