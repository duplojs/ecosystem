/**
 * @title DInvocation — Évidences
 *
 * Associer une preuve de provenance à une valeur et sélectionner les résultats qui la portent.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

// Une évidence indique le passage par un traitement. Elle existe uniquement dans
// le type : l'appelant doit établir la garantie avant de l'ajouter.
declare const id: string;
const generated = DInvocation.appendEvidence(id, "generated");
type _CheckGenerated = DCommon.ExpectType<
	typeof generated,
	string & DInvocation.Evidence<"generated">,
	"strict"
>;

const generatedInPipe = DCommon.pipe(
	id,
	DInvocation.appendEvidence("generated"),
);
type _CheckGeneratedInPipe = DCommon.ExpectType<
	typeof generatedInPipe,
	string & DInvocation.Evidence<"generated">,
	"strict"
>;
// Les deux appels restituent la chaîne inchangée.

declare function useGeneratedId(value: string & DInvocation.Evidence<"generated">): void;
useGeneratedId(generated);
// @ts-expect-error La chaîne seule ne porte pas la preuve.
useGeneratedId(id);

// evidenceResult produit un Right dont l'information et la preuve ont le même nom.
const result = DInvocation.evidenceResult("available", id);
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DInvocation.EvidenceResult<"available", string>,
	"strict"
>;
const resultInPipe = DCommon.pipe(
	id,
	DInvocation.evidenceResult("available"),
);
type _CheckResultInPipe = DCommon.ExpectType<
	typeof resultInPipe,
	DInvocation.EvidenceResult<"available", string>,
	"strict"
>;
// Dans les deux cas, le Right « available » contient la chaîne inchangée.

declare function checkId(): Promise<
	| DInvocation.EvidenceResult<"available", string>
	| DInvocation.EvidenceResult<"already-used", string>
>;

// GetEvidenceResult retrouve la valeur avec la preuve demandée, à travers la promesse et le Result.
type AvailableId = DInvocation.GetEvidenceResult<typeof checkId, "available">;
type _CheckAvailableId = DCommon.ExpectType<
	AvailableId,
	string & DInvocation.Evidence<"available">,
	"strict"
>;
declare function registerId(value: AvailableId): void;

async function registerCheckedId() {
	const selected = DCommon.pipe(
		await checkId(),
		DEither.keepAsRightByInformation("available"),
		DEither.unwrapRight,
	);
	// L'issue « already-used » devient un Left ; la valeur disponible est extraite.
	if (DEither.isLeft(selected)) {
		return selected;
	}
	registerId(selected);
	return DEither.ok();
}

// La recherche traverse aussi les Left, Right et les valeurs yield ou return des génératrices.
declare function inspectId(): AsyncGenerator<DEither.Left<"inspection", string & DInvocation.Evidence<"inspected">>>;
type InspectedId = DInvocation.GetEvidenceResult<typeof inspectId, "inspected">;
type _CheckInspectedId = DCommon.ExpectType<
	InspectedId,
	string & DInvocation.Evidence<"inspected">,
	"strict"
>;
