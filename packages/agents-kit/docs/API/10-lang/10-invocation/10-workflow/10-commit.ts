/**
 * @title DInvocation.workflowCommitGenerator
 *
 * Confier des données à une action extérieure et, au besoin, exiger une fonction avec withSignature.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

// createWorkflow expose workflowCommitGenerator sous le nom commit.
declare function save(id: string, name: string): Promise<
	| DEither.Ok
	| DEither.Left<"save-failed", string>
>;
const transmit = DInvocation.createWorkflow(({ commit }) => function *(id: string, name: string) {
	const transmitted = yield *commit("user", id, name);
	type _CheckTransmitted = DCommon.ExpectType<
		typeof transmitted,
		void,
		"strict"
	>;
	return name;
});
const result = DInvocation.consumeWorkflow(transmit("42", "Ada"), {
	"commit/user": save,
});
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<string | DEither.Left<"save-failed", string>>,
	"strict"
>;
// Le consommateur attend la prise en charge avant de poursuivre. Le Left arrête
// le parcours ; toute autre valeur de retour est ignorée, y compris un Right.

// withSignature exige le contrat de fonction choisi par le workflow.
// Une SignedFunction ajoute l'identité de l'action au-delà de sa forme TypeScript.
type Notify = DInvocation.SignedFunction<"notify-user", (id: string) => DEither.Ok>;
declare const notify: Notify;

const notifyUser = DInvocation.createWorkflow(({ commit }) => function *(id: string) {
	yield *commit("notification", id).withSignature<Notify>();
});
const notified = DInvocation.consumeWorkflow(notifyUser("42"), {
	"commit/notification": notify,
});
type _CheckNotified = DCommon.ExpectType<
	typeof notified,
	Promise<void>,
	"strict"
>;

void DInvocation.consumeWorkflow(notifyUser("42"), {
	// @ts-expect-error Une fonction de même forme sans l'identité notify-user ne suffit pas.
	"commit/notification": () => DEither.ok(),
});

// Un commit peut aussi demander une action sans donnée d'entrée.
const flush = DInvocation.createWorkflow(({ commit }) => function *() {
	yield *commit("flush");
});
const flushed = DInvocation.consumeWorkflow(flush(), {
	"commit/flush": () => DEither.ok(),
});
type _CheckFlushed = DCommon.ExpectType<
	typeof flushed,
	Promise<void>,
	"strict"
>;
