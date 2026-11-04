/**
 * @title DPath.computeRelative
 *
 * Calculer le chemin relatif entre deux chemins absolus.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const source = DPath.declareAbsolutePath("/workspace/src");
const destination = DPath.declareAbsolutePath("/workspace/test/index.ts");
const result = DPath.computeRelative(source, destination);

// Le chemin obtenu est ../test/index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Path, "strict">;
