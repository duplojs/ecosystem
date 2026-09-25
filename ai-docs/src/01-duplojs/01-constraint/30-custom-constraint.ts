/**
 * @title Créations de `Constraint` customisées.
 *
 * DuploJS met à disposition énormément de contraintes, mais il est tout
 * à fait possible de créer ses propres contraintes. Il suffit juste
 * d'étendre l'interface `Constraint`.
 *
 * Il faut évidemment associer un predicate à la contrainte afin de pouvoir
 * l'obtenir par une vérification.
 *
 * Il est également possible d'ajouter des casts customisés selon le
 * besoin. Pour cela, il suffit de déclarer des override de modules.
 */

import type * as DCommon from "@duplojs/lang/common";

interface MySuperConstraint extends DCommon.Constraint<"my-super-constraint"> {}

declare function mySuperPredicate(input: string): input is string & MySuperConstraint;

declare module "@duplojs/lang/common" {
	// N'hésitez pas à regarder le code des interfaces pour comprendre le fonctionnement.
	interface ComputeCastConstraintNumberRule<
		GenericValue extends number,
		GenericExpectedConstraint extends DCommon.BaseConstraint,
	> {
		// Mettre la règle que tu souhaites.
	}
}
