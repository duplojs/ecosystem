/**
 * @title DInvocation.createWorkflow
 *
 * Déclarer un parcours avec des effets et composer ses étapes par délégation de génératrices.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const notifyUser = DInvocation.createWorkflow(({ commit }) => function *(name: string) {
	yield *commit("notify", name);
	return name;
});

// L'initialisation reçoit les effets une seule fois et retourne la fonction à appeler.
// Les paramètres du générateur sont les entrées de chaque nouvelle exécution.
const welcomeUser = DInvocation.createWorkflow(({ resolve }) => function *(id: string) {
	const name: string = yield *resolve("user-name", id);
	return yield *notifyUser(name);
});

const result = DInvocation.consumeWorkflow(welcomeUser("42"), {
	"resolve/user-name": () => DEither.success("Ada"),
	"commit/notify": () => DEither.ok(),
});
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<string>,
	"strict"
>;
// La délégation au workflow imbriqué expose aussi son commit au consommateur.

// @ts-expect-error Une génératrice de workflow ne peut émettre que les effets pris en charge.
DInvocation.createWorkflow(() => function *() {
	yield 42;
});
