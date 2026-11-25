/**
 * @title DSPath.createSegmentOrThrow
 *
 * Normaliser un segment de plateforme ou lever une erreur.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

const segment = DSPath.createSegmentOrThrow("src/../index.ts");
// Le résultat vaut "index.ts". Si le résultat n'est pas un segment, une
// CreateSegmentPathError porte l'entrée dans value ; createSegment retourne un Either.
type _CheckSegment = DCommon.ExpectType<
	typeof segment,
	string & DPath.Segment & DPath.Path,
	"strict"
>;
