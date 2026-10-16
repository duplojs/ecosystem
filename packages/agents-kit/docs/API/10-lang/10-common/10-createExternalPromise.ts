/**
 * @title DCommon.createExternalPromise
 *
 * Exposer les contrôles `resolve` et `reject` d’une promise séparément de sa création.
 */
import * as DCommon from "@duplojs/lang/common";

const external = DCommon.createExternalPromise<string>();
const result = external.promise;

// La promise est résolue séparément par la méthode resolve.
external.resolve("done");
type _CheckResult = DCommon.ExpectType<typeof result, Promise<string>, "strict">;
