/**
 * @title DInvocation.aborter
 *
 * Fournir un signal d'annulation à une étape et interrompre son exécution précédente.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare function request(query: string, signal: AbortSignal): Promise<string>;
declare function display(response: string): number;
const search = DInvocation.flow(
	DInvocation.aborter(
		(
			query: string,
			controller,
		) => request(query, controller.signal),
		{ timeout: "5s" },
	),
	display,
);
const first = search("flo");
const second = search("flow");
type _CheckResult = DCommon.ExpectType<
	typeof first,
	Promise<number | DEither.Left<"signal-aborted", DInvocation.AbortErrorFlowController>>,
	"strict"
>;
type _CheckSecond = DCommon.ExpectType<
	typeof second,
	Promise<number | DEither.Left<"signal-aborted", DInvocation.AbortErrorFlowController>>,
	"strict"
>;
// La seconde arrivée à aborter signale l'annulation de la première requête.
// Le timeout optionnel signale aussi l'annulation après cinq secondes.
// La requête doit coopérer avec le signal : aborter ne force pas sa résolution.
// Une annulation reconnue renvoie signal-aborted ; les autres erreurs sont propagées.
