/**
 * @title Générer la documentation OpenAPI d'une API HTTP.
 *
 * Décrire les réponses des routes et exposer leur documentation.
 */
import { createHub, useRouteBuilder } from "@duplojs/http";
import { OpenApiEndpointContractMetadata, openApiGeneratorPlugin } from "@duplojs/http/openApiGenerator";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Le plugin reprend les entrées déclarées dans les extractions. Décrire les
// réponses à documenter avec `OpenApiEndpointContractMetadata` sur les étapes
// concernées. Ces métadonnées servent à la documentation ; elles ne valident
// pas les réponses envoyées par la route.
const helloRoute = useRouteBuilder("GET", "/hello")
	.extract(
		{
			query: { name: DDataStructure.string() },
		},
		({ response }) => response.badRequest("hello.invalid"),
		OpenApiEndpointContractMetadata({
			code: "400",
			information: "hello.invalid",
		}),
	)
	.handler(
		({ name }, { response }) => response.ok("hello.received", { name }),
		OpenApiEndpointContractMetadata({
			code: "200",
			information: "hello.received",
			body: DDataStructure.object({ name: DDataStructure.string() }),
		}),
	);

// Le plugin collecte les entrées des extractions et les métadonnées de sortie
// des routes, de leurs étapes et de leurs processus, y compris le preflight.
// Sans métadonnées de sortie, une réponse de handler n'est pas documentée.
// Une extraction sans métadonnée locale documente par défaut 422 / extract-error.
// Si le refus par défaut du Hub change, adapter aussi `defaultExtractMetadata`
// dans les options du plugin ; un refus local se décrit comme ci-dessus.
export const documentedHub = createHub({ environment: "DEV" })
	.register(helloRoute)
	.plug(openApiGeneratorPlugin({ routePath: "/swagger" }));

// Le connecteur déclenche la génération en environnement DEV ou BUILD.
