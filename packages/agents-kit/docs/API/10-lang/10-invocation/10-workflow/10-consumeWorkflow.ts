/**
 * @title DInvocation.consumeWorkflow
 *
 * Satisfaire les effets d'un workflow et restituer son résultat ou le refus qui interrompt son parcours.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare function readName(id: string): Promise<
	| DEither.Success<string>
	| DEither.Left<"user-not-found", string>
>;
declare function saveName(name: string): Promise<DEither.Ok | DEither.Left<"save-failed", string>>;

const workflow = DInvocation.createWorkflow(({ resolve, commit }) => function *(id: string) {
	const name: string = yield *resolve("user", id);
	yield *commit("user", name);
	return name;
});

// Les préfixes distinguent les catégories, même lorsque le nom est identique.
// Les implémentations peuvent être synchrones ou asynchrones ; elles sont attendues.
const result = DInvocation.consumeWorkflow(workflow("42"), {
	"resolve/user": readName,
	"commit/user": saveName,
});
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<
		| string
		| DEither.Left<"user-not-found", string>
		| DEither.Left<"save-failed", string>
	>,
	"strict"
>;
// Un refus de lecture empêche le commit. Un refus du commit empêche le retour final.
// Une exception ou une promesse rejetée rejette result et ferme le générateur.

// @ts-expect-error Tous les effets déclarés, y compris ceux des workflows imbriqués, sont requis.
void DInvocation.consumeWorkflow(workflow("42"), { "resolve/user": readName });

// @ts-expect-error Les implémentations supplémentaires sont interdites.
void DInvocation.consumeWorkflow(workflow("42"), {
	"resolve/user": readName,
	"commit/user": saveName,
	"commit/unused": () => DEither.ok(),
});
