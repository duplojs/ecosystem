/**
 * @title DCommon.createQueue
 *
 * Créer une file d’attente typée avec une capacité optionnelle.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";

const queue = DCommon.createQueue({ concurrency: 1 });
const result = queue.add(() => "done");

// Le résultat contient la valeur de la tâche, ou un Left si son exécution lève une erreur.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<string | DEither.Left<"execution-error", unknown>>,
	"strict"
>;
