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

		// appendEvidence restitue la même valeur, sans propriété ni contrôle runtime.
		// L'implémentation doit donc avoir établi la garantie avant d'ajouter la preuve.
		// Cela fonctionne aussi avec les valeurs primitives.
		DInvocation.appendEvidence("generated"),
	),
};

// GetEvidenceResult extrait du retour d'une méthode la valeur portant l'évidence demandée.
// createEntity exige ainsi l'Id avec la preuve "generated" du contrat de generateId.
// Deux méthodes annonçant la même valeur et la même évidence restent compatibles :
// pour distinguer leurs provenances, utiliser des noms d'évidence distincts.
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

// Quand l'opération possède plusieurs issues, EvidenceResult associe chaque information
// à une valeur portant l'évidence du même nom. Comme appendEvidence, cette construction
// ne réalise pas la vérification : checkId doit réellement consulter le registre.
interface Registry {
	checkId(id: Id): Promise<
		| DInvocation.EvidenceResult<"id-available", Id>
		| DInvocation.EvidenceResult<"id-already-registered", Id>
	>;
}

// GetEvidenceResult sélectionne ici une seule issue, même à travers la promesse et l'Either.
type AvailableId = DInvocation.GetEvidenceResult<Registry["checkId"], "id-available">;
type _CheckAvailableId = DCommon.ExpectType<AvailableId, Id & DInvocation.Evidence<"id-available">, "strict">;

declare function createRegisteredEntity(id: AvailableId): Entity;

// La couche appelante discrimine le résultat pour obtenir cette preuve.
// La disponibilité autorise la création ; l'autre issue devient un Left,
// propagé par rightAsyncPipe sans appeler createRegisteredEntity.
function registerEntity(registry: Registry, id: Id) {
	return DEither.rightAsyncPipe(
		DCommon.asyncPipe(
			registry.checkId(id),
			DEither.keepAsRightByInformation("id-available"),
		),
		createRegisteredEntity,
	);
}

declare const alreadyRegisteredId: DInvocation.GetEvidenceResult<Registry["checkId"], "id-already-registered">;
// @ts-expect-error Le résultat d'une autre branche ne prouve pas la disponibilité.
createRegisteredEntity(alreadyRegisteredId);

// @ts-expect-error La méthode ne produit pas d'évidence nommée generated.
type UnsupportedEvidence = DInvocation.GetEvidenceResult<Registry["checkId"], "generated">;
