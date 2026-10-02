/**
 * @title Preuves de typage
 *
 * Certaines règles ne concernent pas uniquement la forme d'une donnée,
 * mais aussi les opérations par lesquelles elle est passée.
 *
 * Les `Evidence` permettent de représenter ces preuves uniquement dans
 * le système de types.
 *
 * Les `SignedFunction` appliquent le même principe à l'identité d'une fonction :
 * une dépendance peut demander une fonction précise plutôt qu'une fonction
 * possédant simplement la même signature TypeScript.
 *
 * Ces outils permettent ainsi d'exprimer des relations entre plusieurs
 * opérations directement dans leurs signatures.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

const Id = DModeling.createNewType(
	"Id",
	DDataStructure.string(),
	[DDataStructure.uuid()],
);
type Id = DDataStructure.StructureValue<typeof Id>;

interface Entity {
	id: Id;
}

interface SomeService {
	// Une `Evidence` représente une preuve uniquement au niveau du typage.
	//
	// Ici, `generateId` ne retourne pas simplement un `Id`.
	// Son type garantit également que la valeur est passée par une opération
	// ayant produit l'évidence `generated`.
	//
	// Cette évidence n'existe pas au runtime.
	// Aucune propriété n'est ajoutée à la valeur, ce qui permet notamment
	// d'utiliser ce mécanisme avec des primitives comme `string` ou `number`.
	generateId(): Id & DInvocation.Evidence<"generated">;

	// Une `SignedFunction` associe une identité précise à une fonction.
	//
	// Contrairement à une `Evidence`, cette signature existe également
	// au runtime car une fonction peut porter cette information.
	//
	// Deux fonctions possédant la même signature `() => void` ne sont donc
	// pas nécessairement interchangeables : celle attendue ici doit être
	// identifiée comme `someAction`.
	someAction: DInvocation.SignedFunction<
		"someAction",
		() => void
	>;
}

const implementation: SomeService = {
	generateId: () => DCommon.pipe(
		"someId",
		Id.map,
		DEither.unwrapRightOrThrow,

		// `appendEvidence` associe l'évidence uniquement dans le typage.
		//
		// La valeur runtime reste strictement la même : aucune propriété
		// ou information supplémentaire n'y est ajoutée.
		DInvocation.appendEvidence("generated"),
	),

	// `signedFunction` associe la signature `someAction` à l'implémentation.
	//
	// Cette identité est, elle, conservée au runtime sur la fonction.
	someAction: DInvocation.signedFunction(
		"someAction",
		() => void 0,
	),
};

// `GetEvidenceResult` permet d'exprimer une dépendance envers le résultat
// d'une opération et l'évidence qu'elle produit.
//
// `createEntity` ne demande donc pas simplement un `Id`.
// Il demande un `Id` possédant l'évidence `generated` telle qu'elle est
// produite par `SomeService.generateId`.
declare function createEntity(
	params: {
		id: DInvocation.GetEvidenceResult<
			SomeService["generateId"],
			"generated"
		>;
	},
): Entity;

// Le résultat de `generateId` possède directement l'évidence attendue.
//
// La relation entre la génération de l'identifiant et la création
// de l'entité est ainsi représentée dans le typage.
createEntity({
	id: implementation.generateId(),
});

// Ici, la dépendance ne demande pas une fonction arbitraire `() => void`.
//
// Elle demande précisément la fonction déclarée comme `someAction`
// par le contrat de `SomeService`.
declare function otherFunction(
	someFunction: SomeService["someAction"],
): void;

// L'implémentation signée satisfait directement cette dépendance.
otherFunction(implementation.someAction);
