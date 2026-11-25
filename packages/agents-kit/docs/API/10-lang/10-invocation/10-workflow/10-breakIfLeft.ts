/**
 * @title DInvocation.workflowBreakIfLeftGenerator
 *
 * Propager un Left déjà disponible ou poursuivre avec la valeur d'un Right sans écrire de garde manuelle.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

// createWorkflow expose workflowBreakIfLeftGenerator sous le nom breakIfLeft.
const workflow = DInvocation.createWorkflow(({ breakIfLeft, commit }) => function *(
	input: DEither.Success<string> | DEither.Left<"invalid-name", string>,
) {
	const name = yield *breakIfLeft(input);
	type _CheckName = DCommon.ExpectType<
		typeof name,
		string,
		"strict"
	>;
	yield *commit("name", name);
	return name;
});

declare const input: DEither.Success<string> | DEither.Left<"invalid-name", string>;
const result = DInvocation.consumeWorkflow(workflow(input), {
	"commit/name": () => DEither.ok(),
});
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<string | DEither.Left<"invalid-name", string>>,
	"strict"
>;
// Le Left est restitué tel quel sans exécuter le commit. Un Right fournit sa
// valeur déballée à name. Aucune implémentation break-if-left n'est nécessaire.

const onlyCheck = DInvocation.createWorkflow(({ breakIfLeft }) => function *() {
	return yield *breakIfLeft(DEither.success(42));
});
const checked = DInvocation.consumeWorkflow(onlyCheck(), {});
type _CheckChecked = DCommon.ExpectType<
	typeof checked,
	Promise<42>,
	"strict"
>;
// L'entrée doit être un Either déjà disponible, pas une promesse à résoudre.
