/**
 * @title DPath.createSegment
 *
 * Normaliser une chaîne et vérifier qu’elle ne contient qu’un segment.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";

const result = DPath.createSegment("index.ts");
// Le Right contient index.ts ; une chaîne vide ou contenant un séparateur produit un Left.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<string & DPath.Segment & DPath.Path> | DEither.Error<string>,
	"strict"
>;
