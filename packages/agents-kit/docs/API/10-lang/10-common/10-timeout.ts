/**
 * @title DCommon.timeout
 *
 * Créer une promise résolue après un délai en millisecondes.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.timeout(10);

// Le délai est représenté par une Promise sans valeur.
type _CheckResult = DCommon.ExpectType<typeof result, Promise<void>, "strict">;
