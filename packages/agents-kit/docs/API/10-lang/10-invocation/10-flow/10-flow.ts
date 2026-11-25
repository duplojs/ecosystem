/**
 * @title DInvocation.flow
 *
 * Préparer une fonction composée d'étapes synchrones ou asynchrones et de contrôleurs de flux.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DString from "@duplojs/lang/string";
import type * as DCommon from "@duplojs/lang/common";

interface Request {
	query: string;
	prefix: string;
}
declare function prepare(query: string): Promise<number>;

// Chaque étape reçoit le résultat précédent et l'argument initial en second paramètre.
const search = DInvocation.flow(
	(request: Request) => DString.trim(request.query),
	prepare,
	(count, request) => `${request.prefix} : ${count}`,
);
const result = search({
	query: "flow",
	prefix: "Résultats",
});
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<`${string} : ${number}`>,
	"strict"
>;

// Le flow renvoie toujours une Promise, même si toutes ses étapes sont synchrones.
// Une exception ou une Promise rejetée rejette cette Promise.
