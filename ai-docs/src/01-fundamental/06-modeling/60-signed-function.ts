/**
 * @title Identité des fonctions dans les dépendances.
 *
 * Exiger une fonction identifiée au-delà de sa seule signature TypeScript.
 */
import * as DInvocation from "@duplojs/lang/invocation";

interface ActionService {
	// Deux fonctions () => void ne sont pas nécessairement interchangeables dans le modèle.
	// SignedFunction ajoute à cette signature l’identité de l’opération attendue.
	someAction: DInvocation.SignedFunction<"someAction", () => void>;
}

const implementation: ActionService = {
	// signedFunction associe l’identité à l’implémentation.
	// Cette information existe au runtime sur la fonction, contrairement à une Evidence.
	someAction: DInvocation.signedFunction("someAction", () => void 0),
};

// La dépendance exige précisément l’opération identifiée comme someAction.
declare function otherFunction(someFunction: ActionService["someAction"]): void;

otherFunction(implementation.someAction);

// @ts-expect-error Une même signature d’appel ne suffit pas sans l’identité attendue.
otherFunction(() => void 0);
