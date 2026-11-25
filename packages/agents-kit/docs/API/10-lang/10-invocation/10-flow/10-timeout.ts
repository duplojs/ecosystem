/**
 * @title DInvocation.timeout
 *
 * Ajouter une pause entre les étapes d'un flow.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DString from "@duplojs/lang/string";
import type * as DCommon from "@duplojs/lang/common";

declare function send(value: number): Promise<string>;
const delayedSend = DInvocation.flow(
	(input: string) => DString.length(DString.trim(input)),
	DInvocation.timeout("1s"),
	send,
);
// Après le calcul de la longueur, le flow attend une seconde avant d'appeler send avec son résultat.
const result = delayedSend("message");
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<string>,
	"strict"
>;
// Une sortie anticipée précédente est transmise sans attendre.
