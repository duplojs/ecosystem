/**
 * @title DPath.resolveFrom
 *
 * Résoudre des segments depuis une origine absolue, avec une option pour la conserver.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const origin = DPath.declareAbsolutePath("/workspace");
const result = DPath.resolveFrom(
	origin,
	[DPath.declarePath("src"), DPath.declarePath("index.ts")],
	{ stayInOrigin: true },
);
// La valeur obtenue est /workspace/src/index.ts. Une résolution qui sort de l’origine vaut null.
type _CheckResult = DCommon.ExpectType<typeof result, (string & DPath.Path & DPath.Absolute) | null, "strict">;
