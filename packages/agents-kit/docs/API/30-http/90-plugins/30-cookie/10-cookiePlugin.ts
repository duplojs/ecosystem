/**
 * @title cookiePlugin
 *
 * Lire, valider, écrire et supprimer des cookies dans les routes.
 */
import { createHookRouteLifeCycle, createHub, useRouteBuilder } from "@duplojs/http";
import { cookiePlugin, defaultParser, defaultSerializer, IgnoreRouteCookieMetadata } from "@duplojs/http/cookie";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const hub = createHub({ environment: "DEV" })
	.plug(
		cookiePlugin({
			parser: defaultParser,
			serializer: defaultSerializer,
		}),
	);

const session = useRouteBuilder("GET", "/session", {
	hooks: [
		createHookRouteLifeCycle({
			beforeSendResponse({ request, currentResponse, next }) {
				if (request.cookies?.session) {
					currentResponse.setHeader("x-session-present", "true");
				}

				return next();
			},
		}),
	],
})
	.extract({
		cookies: {
			session: DDataStructure.string(),
		},
	})
	.handler(
		({ session }, { response }) => response
			.ok("session.found", { session })
			.setCookie("refresh", "next-token", {
				httpOnly: true,
				secure: true,
				path: "/",
				sameSite: "lax",
			}),
	);

const logout = useRouteBuilder("POST", "/logout")
	.handler(
		(__, { response }) => response
			.noContent("session.closed")
			.dropCookie("session"),
	);

const ignored = useRouteBuilder("GET", "/health", {
	metadata: [IgnoreRouteCookieMetadata()],
})
	.handler(
		(__, { response }) => response.noContent("healthy"),
	);

hub.register([session, logout, ignored]);

// Le hook lit le header Cookie avant l'exécution et renseigne request.cookies
// seulement s'il existe. Une extraction cookies valide ensuite ses valeurs et
// les place dans le floor ; sans extraction, un hook peut lire request.cookies.
// Le parseur et le sérialiseur sont remplaçables par des fonctions de mêmes
// signatures ; les valeurs ci-dessus sont les défauts. setCookie accepte notamment
// maxAge, domain, path, httpOnly, secure, sameSite, expires ou expireIn.
// dropCookie émet une valeur vide avec Max-Age=0 ; pour cibler un cookie ayant
// un chemin ou domaine particulier, utiliser setCookie avec ces attributs et
// maxAge: 0. IgnoreRouteCookieMetadata désactive les hooks sur la route.
