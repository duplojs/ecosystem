/**
 * @title DInvocation.debounce
 *
 * Ne poursuivre que la dernière exécution après une période sans nouvelle arrivée.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DString from "@duplojs/lang/string";
import type * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare function search(query: string): Promise<number>;
const searchAfterPause = DInvocation.flow(
	DInvocation.debounce<string>("300ms"),
	(query) => search(DString.trim(query)),
);
const first = searchAfterPause("flo");
const last = searchAfterPause("flow");
type _CheckFirst = DCommon.ExpectType<
	typeof first,
	Promise<number | DEither.Left<"debounce-reject">>,
	"strict"
>;
type _CheckLast = DCommon.ExpectType<
	typeof last,
	Promise<number | DEither.Left<"debounce-reject">>,
	"strict"
>;
// La première attente est interrompue par la seconde : first renvoie debounce-reject.
// Après 300 ms sans nouvelle arrivée au contrôleur, last poursuit vers search.
// Les étapes placées avant debounce s'exécutent pour chaque appel.
