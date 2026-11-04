/**
 * @title DPath.isSegment
 *
 * Vérifier qu’une chaîne est un segment unique et affiner son type.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

declare const value: string;

if (DPath.isSegment(value)) {
	type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Segment, "strict">;
	const extracted = DPath.concatSegment(DPath.declareSegment("file"), value);
	type _CheckExtracted = DCommon.ExpectType<typeof extracted, string & DPath.Segment, "strict">;
}

const segment = DPath.isSegment(".ts");
// Le test runtime produit true.
type _CheckSegment = DCommon.ExpectType<typeof segment, boolean, "strict">;

const fullPath = DCommon.pipe(
	value,
	DCommon.when(
		DPath.isSegment,
		(validSegment) => {
			type _CheckValidSegment = DCommon.ExpectType<typeof validSegment, string & DPath.Segment, "strict">;

			return DPath.concatSegment(DPath.declareSegment("file"), validSegment);
		},
	),
);
// Le segment est ajouté au nom de fichier ; une chaîne qui n’est pas un segment reste inchangée.
type _CheckFullPath = DCommon.ExpectType<typeof fullPath, string | (string & DPath.Segment), "strict">;

// Sur un littéral déjà valide, le predicate conserve le type littéral sans ajouter de contrainte.
const known = "index.ts";
if (DPath.isSegment(known)) {
	type _CheckKnown = DCommon.ExpectType<typeof known, "index.ts", "strict">;
	// Pour obtenir un chemin contraint depuis cette constante, utiliser sa déclaration sûre.
	const declared = DPath.declareSegment(known);
	type _CheckDeclared = DCommon.ExpectType<typeof declared, "index.ts" & DPath.Segment & DPath.Path, "strict">;
}
