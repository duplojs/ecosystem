/**
 * @title DInvocation.exclusive
 *
 * Refuser les exécutions concurrentes d'un flow pendant qu'une exécution est en cours.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DString from "@duplojs/lang/string";
import type * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare function save(input: string): Promise<number>;
const saveExclusively = DInvocation.flow(
	DInvocation.exclusive<string>(),
	(input) => save(DString.trim(input)),
);
const first = saveExclusively("premier");
const second = saveExclusively("second");
type _CheckFirst = DCommon.ExpectType<
	typeof first,
	Promise<number | DEither.Left<"exclusive-reject">>,
	"strict"
>;
type _CheckSecond = DCommon.ExpectType<
	typeof second,
	Promise<number | DEither.Left<"exclusive-reject">>,
	"strict"
>;
// Tant que la première exécution est active, la seconde reçoit exclusive-reject.
// Le verrou est libéré à la fin du flow, y compris en cas d'erreur ou de sortie anticipée.
// Une même instance de contrôleur partagée entre plusieurs flows partage aussi son verrou.
