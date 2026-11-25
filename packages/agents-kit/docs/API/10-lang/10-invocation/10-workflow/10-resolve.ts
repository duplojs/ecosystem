/**
 * @title DInvocation.workflowResolveGenerator
 *
 * Demander une valeur extérieure avec des entrées et définir son contrat par inférence contextuelle ou avec expect.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

// createWorkflow expose workflowResolveGenerator sous le nom resolve.
// Les deux formes ci-dessous expriment le même contrat, selon la préférence de rédaction.
const inferred = DInvocation.createWorkflow(({ resolve }) => function *(id: string) {
	const name: string = yield *resolve("user-name", id);
	return name;
});
const explicit = DInvocation.createWorkflow(({ resolve }) => function *(id: string) {
	const name = yield *resolve("user-name", id).expect<string>();
	type _CheckName = DCommon.ExpectType<
		typeof name,
		string,
		"strict"
	>;
	return name;
});

const inferredResult = DInvocation.consumeWorkflow(inferred("42"), {
	"resolve/user-name": () => DEither.success("Ada"),
});
type _CheckInferredResult = DCommon.ExpectType<
	typeof inferredResult,
	Promise<string>,
	"strict"
>;
const explicitResult = DInvocation.consumeWorkflow(explicit("42"), {
	"resolve/user-name": () => DEither.success("Ada"),
});
type _CheckExplicitResult = DCommon.ExpectType<
	typeof explicitResult,
	Promise<string>,
	"strict"
>;
// expect ne valide ni ne convertit la donnée au runtime : le consommateur doit
// fournir un Either dont le Right satisfait le contrat attendu.

declare function findName(id: string, source: string): Promise<
	| DEither.Right<"found", string>
	| DEither.Left<"not-found", string>
>;
const withInputs = DInvocation.createWorkflow(({ resolve }) => function *(id: string) {
	return yield *resolve("user-name", id, "directory").expect<string>();
});
const withInputsResult = DInvocation.consumeWorkflow(withInputs("42"), {
	"resolve/user-name": findName,
});
type _CheckWithInputsResult = DCommon.ExpectType<
	typeof withInputsResult,
	Promise<string | DEither.Left<"not-found", string>>,
	"strict"
>;
// Les arguments suivent le nom ; le Right est déballé et le Left interrompt le workflow.

const unspecified = DInvocation.createWorkflow(({ resolve }) => function *() {
	const value = yield *resolve("value");
	return value;
});
const unspecifiedResult = DInvocation.consumeWorkflow(unspecified(), {
	"resolve/value": () => DEither.success(42),
});
type _CheckUnspecifiedResult = DCommon.ExpectType<
	typeof unspecifiedResult,
	Promise<unknown>,
	"strict"
>;
// Sans contrat contextuel ni expect, le résultat reste unknown dans le workflow.
