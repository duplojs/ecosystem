/**
 * @title DPath.createSegment
 *
 * Normaliser une chaîne et vérifier qu’elle ne contient qu’un segment.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";

const result = DPath.createSegment("index.ts");
// Le Right contient index.ts. La validation porte sur le résultat de la normalisation.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DEither.Success<string & DPath.Segment & DPath.Path> | DEither.Error<string>,
	"strict"
>;

// Normaliser avant de valider : un chemin composé peut devenir un segment unique.
const normalized = DPath.createSegment("src/../index.ts");
// Success contient index.ts, même si l’entrée contenait des séparateurs.
type _CheckNormalized = DCommon.ExpectType<typeof normalized, DEither.Success<string & DPath.Segment & DPath.Path> | DEither.Error<string>, "strict">;

// Refus : après normalisation, src/index.ts contient encore deux segments.
const rejected = DPath.createSegment("src/index.ts");
// Error contient l’entrée originale src/index.ts. "", "." et ".." sont aussi refusés.
type _CheckRejected = DCommon.ExpectType<typeof rejected, DEither.Success<string & DPath.Segment & DPath.Path> | DEither.Error<string>, "strict">;
