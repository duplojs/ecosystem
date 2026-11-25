/**
 * @title DSPath.createSegment
 *
 * Normaliser un chemin de plateforme et vérifier qu'il est un segment.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

const result = DSPath.createSegment("src/../index.ts");
// La validation suit la normalisation : Success contient "index.ts".
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<string & DPath.Segment & DPath.Path> | DEither.Left<"create-segment-path-error", string>,
	"strict"
>;

