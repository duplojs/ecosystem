/**
 * @title PreflightBuilder.exec
 *
 * Ajouter un process et importer ses données dans le preflight.
 */
import { usePreflightBuilder, useProcessBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const requestContext = useProcessBuilder()
	.extract({
		headers: {
			"x-tenant": DDataStructure.string(),
			"x-request-id": DDataStructure.string(),
		},
	})
	.exports(["x-tenant", "x-request-id"]);

const tenantAccess = useProcessBuilder({
	options: { tenant: "public" },
})
	.cut(
		({ options }, { output, response }) => {
			if (options.tenant === "blocked") {
				return response.forbidden("tenant.blocked");
			}

			return output({ tenant: options.tenant });
		},
	)
	.exports(["tenant"]);

const preflight = usePreflightBuilder()
	.exec(requestContext, { imports: ["x-tenant"] })
	.exec(tenantAccess, {
		imports: ["tenant"],
		options: (floor) => ({ tenant: floor["x-tenant"] }),
	});

preflight.useRouteBuilder("GET", "/tenant")
	.handler(
		({ tenant }, { response }) => response.ok("tenant.read", { tenant }),
	);

// requestContext rend deux clés importables ; seul x-tenant est sélectionné.
// Le deuxième exec calcule ses options depuis le floor enrichi par le premier,
// puis importe tenant. Le floor de chaque process reste distinct de celui du
// preflight. Sans imports, aucune donnée du process n'est ajoutée à ce dernier.
// Une clé importée remplace une clé homonyme existante.
//
// Les options peuvent aussi être fournies directement ; sans remplacement,
// le process utilise ses valeurs par défaut. Le remplacement concerne l'objet
// entier. Des metadata applicatives peuvent suivre les paramètres de exec.
const publicPreflight = usePreflightBuilder()
	.exec(tenantAccess, {
		imports: ["tenant"],
		options: { tenant: "public" },
	});

// Les process s'exécutent dans l'ordre des exec, avant les steps de route.
// Une réponse d'un process interrompt les process et steps suivants, y compris
// le handler ; elle n'est pas importée dans le floor.
