/**
 * @title openApiGeneratorPlugin
 *
 * Générer une documentation OpenAPI à partir des routes.
 */
import { createHub, useRouteBuilder } from "@duplojs/http";
import { openApiGeneratorPlugin, OpenApiEndpointContractMetadata, IgnoreByOpenApiGeneratorMetadata } from "@duplojs/http/openApiGenerator";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPath from "@duplojs/lang/path";

const user = DDataStructure.object({
	name: DDataStructure.string(),
});

const route = useRouteBuilder("GET", "/users/{id}")
	.extract({
		params: {
			id: DDataStructure.number(),
		},
	})
	.handler(
		({ id }, { response }) => response.ok("user.found", {
			name: `User ${id}`,
		}),
		OpenApiEndpointContractMetadata({
			code: "200",
			information: "user.found",
			body: user,
		}),
	);

const internal = useRouteBuilder("GET", "/internal", {
	metadata: [IgnoreByOpenApiGeneratorMetadata()],
})
	.handler(
		(__, { response }) => response.noContent("internal"),
	);

const hub = createHub({ environment: "DEV" })
	.register([route, internal])
	.plug(
		openApiGeneratorPlugin({
			title: "Users API",
			version: "1.0.0",
			routePath: "/swagger",
			outputFile: DPath.declarePath("openapi.json"),
			security: {
				type: "bearer",
				bearerFormat: "JWT",
			},
		}),
	);

// En DEV ou BUILD, au moment de construire les routes, le plugin produit un
// document OpenAPI 3.1 si routePath ou outputFile est fourni et si au moins une
// route est retenue. outputFile écrit le JSON ; routePath ajoute une page Swagger
// UI. Les deux sorties peuvent être activées ensemble. OPTIONS est exclu.
// Les extractions décrivent les entrées ; les réponses viennent des metadata,
// pas de l'inférence du handler. OpenApiEndpointContractMetadata accepte un ou
// plusieurs contrats : réponse normale avec body, serverSentEvents avec events,
// stream ou streamText avec flux. La metadata peut être placée sur les steps ou
// les routes ; IgnoreByOpenApiGeneratorMetadata exclut la route ou le step.
// defaultExtractMetadata remplace le contrat d'échec d'extraction par défaut
// (422 / extract-error). title, version, summary, contact, license, servers,
// security et swaggerUiVersion configurent le document et la page.
