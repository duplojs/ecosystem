/**
 * @title RouteBuilder.check
 *
 * Interpréter les résultats d'un checker et enrichir le floor d'une route.
 */
import { useRouteBuilder, type CheckerFunctionOutput } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { userChecker } from "./10-useCheckerBuilder";

// input et options reçoivent le floor disponible avant cette step. Les options
// remplacent celles par défaut du checker : elles ne sont pas fusionnées.
useRouteBuilder("GET", "/users/{id}")
	.extract({
		params: { id: DDataStructure.string() },
		query: { includeInactive: DDataStructure.boolean() },
	})
	.check(
		userChecker,
		{
			input: ({ id }) => id,
			options: ({ includeInactive }) => ({ allowInactive: includeInactive }),
			result: "user.found",
			indexing: "user",
			otherwise: ({ response, result, floor }) => {
				type _Rejected = DCommon.ExpectType<
					typeof result,
					| CheckerFunctionOutput<"user.missing", { id: string }>
					| CheckerFunctionOutput<"user.inactive", {
						id: string;
						active: boolean;
					}>,
					"strict"
				>;

				if (result.information === "user.missing") {
					return response.notFound("user.notFound", result.value.id);
				}

				return response.forbidden("user.inactive", { id: floor.id });
			},
		},
	)
	.handler(
		({ user }, { response }) => response.ok("user.found", user),
	);

// Plusieurs informations acceptées produisent l'union de leurs valeurs sous
// indexing. Sans indexing, le floor reste inchangé. Les options peuvent aussi
// être fournies directement comme objet ; si elles sont omises, les valeurs
// par défaut du checker sont utilisées.
useRouteBuilder("GET", "/users/{id}/status")
	.extract({ params: { id: DDataStructure.string() } })
	.check(
		userChecker,
		{
			input: ({ id }) => id,
			options: { allowInactive: false },
			result: ["user.found", "user.missing"],
			indexing: "lookup",
			otherwise: ({ response }) => response.forbidden("user.inactive"),
		},
	)
	.handler(
		({ lookup }, { response }) => {
			type _Lookup = DCommon.ExpectType<
				typeof lookup,
				{
					id: string;
					active: boolean;
				} | { id: string },
				"strict"
			>;

			return response.ok("user.status", lookup);
		},
	);

// Des metadata applicatives peuvent suivre l'objet de configuration. Elles
// sont attachées à la step. La réponse de otherwise interrompt le flux et fait
// partie des réponses possibles de la route.
