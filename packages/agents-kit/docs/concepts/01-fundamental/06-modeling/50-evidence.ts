/**
 * @title Preuves de passage par une opération.
 *
 * Exiger dans les types qu’une valeur soit passée par un traitement préalable.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

// Certaines règles portent sur le parcours d’une valeur plutôt que sur sa seule forme.
const Id = DModeling.createNewType(
	"Id",
	DDataStructure.string(),
	[DDataStructure.uuid()],
);
type Id = DDataStructure.StructureValue<typeof Id>;

interface Entity {
	id: Id;
}

interface IdGenerator {
	// Evidence représente uniquement dans le typage la preuve produite par une opération.
	// Le résultat ne porte pas seulement un Id, mais aussi la preuve "generated".
	generateId(): Id & DInvocation.Evidence<"generated">;
}

const implementation: IdGenerator = {
	generateId: () => DCommon.pipe(
		"550e8400-e29b-41d4-a716-446655440000",
		Id.map,
		DEither.unwrapRightOrThrow,

		// appendEvidence restitue exactement la même valeur au runtime.
		// Aucune propriété n’est ajoutée : cela fonctionne aussi avec les valeurs primitives.
		DInvocation.appendEvidence("generated"),
	),
};

// GetEvidenceResult lie la précondition au résultat et à la preuve d’une opération donnée.
// createEntity demande l’Id portant l’évidence produite par IdGenerator.generateId.
declare function createEntity(
	params: {
		id: DInvocation.GetEvidenceResult<IdGenerator["generateId"], "generated">;
	},
): Entity;

// La relation entre génération et création est exprimée dans la signature.
createEntity({ id: implementation.generateId() });

declare const idWithoutEvidence: Id;
// @ts-expect-error Un Id seul ne prouve pas le passage par la génération attendue.
createEntity({ id: idWithoutEvidence });
