/**
 * @title DPath.getExtensionName
 *
 * Lire l’extension du dernier segment, avec la possibilité de conserver le point.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const path = DPath.declarePath("src/index.test.ts");
const result = DPath.getExtensionName(path, { withDot: true });
// La valeur obtenue est .ts ; null indique l’absence d’extension.
type _CheckResult = DCommon.ExpectType<typeof result, (string & DPath.Segment & DPath.Path) | null, "strict">;
