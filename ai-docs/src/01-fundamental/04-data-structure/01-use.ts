/**
 * @title Contrats de données avec DataStructure.
 *
 * Décrire les données attendues et obtenir des valeurs typées après validation.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

// Une structure porte le même contrat dans TypeScript et au runtime.
// L’utiliser aux frontières du logiciel pour vérifier les données encore inconnues.
const userStructure = DDataStructure.object({
	name: DDataStructure.string(),
	email: DDataStructure.string([DDataStructure.email()]),
});
type User = DDataStructure.StructureValue<typeof userStructure>;

declare const input: unknown;
const result = userStructure.check(input);
if (DEither.isRight(result)) {
	const user: User = DEither.unwrapRight(result);
}
// Un Left conserve une erreur structurée lorsque la validation échoue.
