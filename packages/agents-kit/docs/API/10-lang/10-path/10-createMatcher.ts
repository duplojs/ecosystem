/**
 * @title DPath.createMatcher
 *
 * Créer un predicate de chemin à partir de motifs glob positifs et négatifs.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const matcher = DPath.createMatcher(["*.ts", "!dist"]);
type _CheckMatcher = DCommon.ExpectType<typeof matcher, DPath.PathMatcher, "strict">;
const sourceFile = DPath.declarePath("src/index.ts");
const result = matcher(sourceFile);
// Le résultat vaut true : le chemin correspond au motif TypeScript et n’est pas exclu.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

const excludedFile = matcher(DPath.declarePath("dist/index.ts"));
// Le résultat vaut false : le motif négatif exclut le dossier dist.
type _CheckExcludedFile = DCommon.ExpectType<typeof excludedFile, boolean, "strict">;

declare const candidate: DPath.AnyPath;

if (matcher(candidate)) {
	// Le matcher ne raffine pas le type du chemin.
	type _CheckCandidate = DCommon.ExpectType<typeof candidate, DPath.AnyPath, "strict">;
}

const normalized = DCommon.pipe(
	candidate,
	DCommon.when(
		matcher,
		DPath.normalize,
	),
);
// Un chemin correspondant est normalisé ; les autres restent inchangés.
type _CheckNormalized = DCommon.ExpectType<
	typeof normalized,
	(string & DPath.Path) | null | DPath.AnyPath,
	"strict"
>;
