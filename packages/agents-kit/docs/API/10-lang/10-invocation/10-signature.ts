/**
 * @title DInvocation — Signatures
 *
 * Identifier une fonction au-delà de son contrat TypeScript.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DCommon from "@duplojs/lang/common";

type Notify = DInvocation.SignedFunction<"notify", (message: string) => string>;

// L'identité est attachée à la fonction au runtime.
const notify: Notify = DInvocation.signedFunction<"notify", (message: string) => string>("notify", (message) => `Sent: ${message}`);
const result = notify("hello");
// « Sent: hello »
type _CheckResult = DCommon.ExpectType<
	typeof result,
	string,
	"strict"
>;

declare function subscribe(action: Notify): void;
subscribe(notify);
// @ts-expect-error Une fonction compatible sans la signature « notify » ne suffit pas.
subscribe((message) => message);
