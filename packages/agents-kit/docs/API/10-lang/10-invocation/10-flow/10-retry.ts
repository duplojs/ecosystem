/**
 * @title DInvocation.retry
 *
 * Réexécuter les étapes précédentes d'un flow tant qu'elles renvoient un Left.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DString from "@duplojs/lang/string";
import type * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

declare function save(input: string): Promise<DEither.Right<"saved", number> | DEither.Left<"unavailable">>;

const saveWithRetry = DInvocation.flow(
	(input: string) => save(DString.trim(input)),
	// Trois tentatives au total, séparées par 100 ms en cas de Left.
	DInvocation.retry({
		times: 3,
		timeout: "100ms",
	}),
);
const result = saveWithRetry("document");
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<DEither.Right<"saved", number> | DEither.Left<"unavailable">>,
	"strict"
>;

// Sans times, les tentatives ne sont pas limitées. Un résultat autre qu'un Left
// arrête les tentatives ; une exception ou un rejet n'est pas réessayé.
// Un Left brut restant après la dernière tentative continue vers l'étape suivante :
// placer filter après retry si ce Left doit interrompre le flow. Une sortie
// anticipée produite par un contrôleur précédent n'est pas un Left brut à réessayer.
