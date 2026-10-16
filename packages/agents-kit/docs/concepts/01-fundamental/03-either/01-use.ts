/**
 * @title Représentation des résultats avec Either.
 *
 * Statuts Right et Left, information contextuelle et valeur associée.
 */
import * as DEither from "@duplojs/lang/either";

// Un résultat porte un statut, une information qui identifie le cas et une valeur.
const result = DEither.right("user-found", { name: "Alice" });
const missing = DEither.left("user-not-found");

// Les variantes fournies reposent sur Right (Success, Some, Result, Ok) ou Left
// (Fail, Error, None).
// Result décrit un état contextualisé sans décider s’il constitue un succès ou un échec.
// Un contrat exprime les résultats possibles par une union, avec des informations
// personnalisées ou des variantes fournies.
// Dès qu'une branche d'une fonction renvoie un Right ou un Left, toutes ses
// branches renvoient un Either. Envelopper les valeurs de réussite dans un Right,
// y compris avec ok() pour une réussite sans valeur ; ne pas mélanger des Either
// et des valeurs brutes dans le contrat de retour.
type FindUserResult = DEither.Right<"user-found", { name: "Alice" }> | DEither.Left<"user-not-found", undefined>;
