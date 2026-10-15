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
type FindUserResult = DEither.Right<"user-found", { name: "Alice" }> | DEither.Left<"user-not-found", undefined>;
