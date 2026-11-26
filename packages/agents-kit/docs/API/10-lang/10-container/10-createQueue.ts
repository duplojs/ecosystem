/**
 * @title DContainer.createQueue
 *
 * Créer une file d’attente de tâches avec une concurrence configurable.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DContainer from "@duplojs/lang/container";
import type * as DEither from "@duplojs/lang/either";

const queue = DContainer.createQueue({ concurrency: 1 });
const result = queue.add(() => "done");

// Le résultat contient la valeur de la tâche, ou un Left si son exécution lève une erreur.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<string | DEither.Left<"execution-error", unknown>>,
	"strict"
>;
