/**
 * @title DCommon.createQueue
 *
 * Créer une file d’attente typée avec une capacité optionnelle.
 */
import * as DCommon from "@duplojs/lang/common";

const queue = DCommon.createQueue({ concurrency: 1 });
const result = queue.add(() => "done");

// Chaque tâche est exécutée dans une Promise et ses erreurs sont représentées par un Left.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<"done">,
	"two-extends-one"
>;
