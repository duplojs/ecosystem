/**
 * @title DInvocation.throttling
 *
 * Réguler la poursuite des exécutions d'un flow sur un intervalle de temps.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DString from "@duplojs/lang/string";
import type * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare function update(value: string): Promise<number>;
const updateAtInterval = DInvocation.flow(
	DInvocation.throttling<string>("300ms"),
	(value) => update(DString.trim(value)),
);
const first = updateAtInterval("premier");
const second = updateAtInterval("deuxième");
const third = updateAtInterval("troisième");
type _CheckFirst = DCommon.ExpectType<
	typeof first,
	Promise<number | DEither.Left<"throttling-reject">>,
	"strict"
>;
type _CheckSecond = DCommon.ExpectType<
	typeof second,
	Promise<number | DEither.Left<"throttling-reject">>,
	"strict"
>;
type _CheckThird = DCommon.ExpectType<
	typeof third,
	Promise<number | DEither.Left<"throttling-reject">>,
	"strict"
>;
// La première arrivée continue immédiatement. Durant l'intervalle, la dernière
// arrivée en attente continue à son tour ; une attente remplacée reçoit throttling-reject.
// Les étapes avant le contrôleur s'exécutent pour chaque appel.
