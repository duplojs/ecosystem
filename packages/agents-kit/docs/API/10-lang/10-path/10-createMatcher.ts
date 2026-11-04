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

// Un motif seul est accepté ; * reste dans un segment, ** final traverse les dossiers.
const nestedMatcher = DPath.createMatcher("src/**");
const nested = nestedMatcher(DPath.declarePath("src/deep/index.ts"));
// La valeur obtenue est true.
type _CheckNested = DCommon.ExpectType<typeof nested, boolean, "strict">;

// Il faut au moins une règle positive ; les exclusions gagnent quel que soit leur ordre.
const onlyExclusions = DPath.createMatcher(["!dist"]);
const unselected = onlyExclusions(sourceFile);
// La valeur obtenue est false : aucune règle positive ne sélectionne sourceFile.
type _CheckUnselected = DCommon.ExpectType<typeof unselected, boolean, "strict">;

// Utiliser le matcher comme predicate booléen sur des chemins déjà valides.
declare const candidate: DPath.AnyPath;
if (matcher(candidate)) {
	// Le matcher ne raffine pas le type du chemin et ne consulte pas le disque.
	type _CheckCandidate = DCommon.ExpectType<typeof candidate, DPath.AnyPath, "strict">;
	const name = DPath.getBaseName(candidate);
	type _CheckName = DCommon.ExpectType<typeof name, (string & DPath.Segment & DPath.Path) | null, "strict">;
}

const selectedName = DCommon.pipe(
	candidate,
	DCommon.when(matcher, DPath.getBaseName),
);
// Un chemin correspondant donne son nom ; les autres restent inchangés.
type _CheckSelectedName = DCommon.ExpectType<
	typeof selectedName,
	(string & DPath.Segment & DPath.Path) | null | DPath.AnyPath,
	"strict"
>;
