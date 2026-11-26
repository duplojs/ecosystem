/**
 * @title ProcessBuilder.exec et RouteBuilder.exec
 *
 * Exécuter un process dans une route ou un autre process, avec imports et options.
 */
import { useProcessBuilder, useRouteBuilder } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { accessProcess } from "./10-useProcessBuilder";

// Le process expose identity. Une route choisit de l'importer et remplace
// les options par défaut pour autoriser l'accès invité.
useRouteBuilder("GET", "/public-profile")
	.exec(accessProcess, {
		imports: ["identity"],
		options: { allowGuest: true },
	})
	.handler(
		({ identity }, { response }) => {
			type _Identity = DCommon.ExpectType<
				typeof identity,
				string,
				"strict"
			>;

			return response.ok("profile.visible", { identity });
		},
	);

// La configuration peut aussi dépendre du floor appelant. Le même process
// refuse les invités lorsque allowGuest vaut false. Les options fournies
// remplacent l'objet par défaut en entier ; elles ne sont pas fusionnées.
useRouteBuilder("GET", "/profile")
	.extract({ query: { allowGuest: DDataStructure.boolean() } })
	.exec(accessProcess, {
		imports: ["identity"],
		options: ({ allowGuest }) => ({ allowGuest }),
	})
	.handler(
		({ identity }, { response }) => response.ok("profile.visible", { identity }),
	);

// Un process appelant possède lui aussi son floor et ses propres options.
// Il transmet une configuration au process interne, puis importe identity.
export const profileProcess = useProcessBuilder({ options: { allowGuest: false } })
	.exec(accessProcess, {
		imports: ["identity"],
		options: ({ options }) => ({ allowGuest: options.allowGuest }),
	})
	.cut(
		({ identity }, { output }) => output({ profile: { identity } }),
	)
	.exports(["profile"]);

useRouteBuilder("GET", "/nested-profile")
	.exec(profileProcess, { imports: ["profile"] })
	.handler(
		({ profile }, { response }) => response.ok("profile.visible", profile),
	);

// profileProcess importe identity, mais ne l'exporte pas. La route ne peut donc
// importer que profile. À chaque niveau, exports définit les clés disponibles et
// imports choisit celles à copier. Sans imports, aucune donnée n'est ajoutée.
// Une clé importée remplace une clé de même nom dans le floor appelant. Ce floor
// n'est pas transmis au process : seules les options peuvent utiliser ses valeurs.
//
// Sans options dans exec, les valeurs par défaut du process sont utilisées.
// Des metadata applicatives peuvent suivre le paramètre de configuration.
// Une réponse issue d'une extraction, d'un otherwise ou d'un cut est propagée
// immédiatement, même à travers plusieurs process : les steps restantes et le
// handler ne s'exécutent pas. Ces réponses contribuent au contrat de la route.
// Les exceptions JavaScript ne sont pas ces réponses prévues.
