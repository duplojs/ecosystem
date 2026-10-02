/**
 * @title Erreurs
 *
 * Les erreurs produites par les `DataStructures` sont structurées et conservent
 * la source exacte du problème : structure, type, contrainte ou codec.
 *
 * `createErrorInterpreter` permet ensuite de transformer ces informations
 * techniques en messages exploitables grâce à des dictionnaires.
 *
 * Cette séparation permet de conserver une erreur riche et indépendante
 * de sa représentation finale : message utilisateur, API, logs, traduction, etc.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

const userStructure = DDataStructure.object({
	email: DDataStructure.string([DDataStructure.email()]),
	age: DDataStructure.number([DDataStructure.greaterThanOrEqual(18)]),
});

const checkResult = userStructure.check({
	email: "invalid-email",
	age: 12,
});

// Une erreur contient une liste de `issues`.
// Chaque issue conserve notamment :
// - la donnée invalide,
// - son chemin,
// - la structure source,
// - et éventuellement le `Type` ou la `Constraint` responsable.
const error = DCommon.pipe(
	checkResult,
	DEither.unwrapByInformationOrThrow("check-error"),
);

// Un interpréteur peut utiliser les dictionnaires fournis par DuploJS.
const interpretError = DDataStructure.createErrorInterpreter(
	DDataStructure.defaultErrorInterpreterDataStructureDictionary,
	DDataStructure.defaultErrorInterpreterCodecDictionary,
);

const interpretedIssues = interpretError(error);

// Exemple d'une issue liée à `email()` :
//
// {
//     path: "email",
//     data: "invalid-email",
//     interpretedMessage: {
//         interpretedSource: "Expected a value matching the configured type.",
//         interpretedSubSource: "Expected a valid email address.",
//     },
// }
//
// `interpretedSource` correspond à la structure principale de l'issue.
// `interpretedSubSource` correspond au `Type` ou à la `Constraint`
// ayant provoqué l'erreur.

// Les dictionnaires peuvent être étendus ou surchargés.
// Le callback reçoit directement la source avec son type précis.
const customDataStructureDictionary = {
	...DDataStructure.defaultErrorInterpreterDataStructureDictionary,

	"@DuplojsLangDataStructure/email-constraint": () => (
		"L'adresse email est invalide."
	),

	"@DuplojsLangDataStructure/greater-than-or-equal-constraint": (
		constraint,
	) => (
		`La valeur doit être supérieure ou égale à ${constraint.definition.threshold}.`
	),
} satisfies DDataStructure.StructureDictionaryParams;

const customInterpretError = DDataStructure.createErrorInterpreter(
	customDataStructureDictionary,
	DDataStructure.defaultErrorInterpreterCodecDictionary,
);

const customInterpretedIssues = customInterpretError(error);

// Les messages peuvent également être définis directement sur une instance
// de structure, de type ou de contrainte avec `addMessage`.
//
// Le dictionnaire représente une interprétation globale d'un type d'erreur.
// `addMessage` représente un message spécifique à une instance.

const emailConstraint = DDataStructure.email()
	.addMessage("L'email du compte doit être valide.");

const accountStructure = DDataStructure.object({
	email: DDataStructure.string([emailConstraint]),
});

// Dans ce cas, l'issue conservera les deux informations :
//
// interpretedMessage: {
//     subSource: "L'email du compte doit être valide.",
//     interpretedSubSource: "Expected a valid email address.",
// }
//
// `subSource` vient du message défini directement sur la contrainte.
// `interpretedSubSource` vient du dictionnaire.

// Les erreurs de codecs suivent le même principe.
//
// Contrairement aux structures, les codecs sont identifiés directement
// par leur instance dans le dictionnaire.
const codecInterpreter = DDataStructure.createErrorInterpreter(
	DDataStructure.defaultErrorInterpreterDataStructureDictionary,
	DDataStructure.defaultErrorInterpreterCodecDictionary,
);

// L'interpréteur permet donc de séparer :
//
// DataStructure
//      |
//      v
// Error + Issues
//      |
//      v
// createErrorInterpreter
//      |
//      v
// messages adaptés au contexte d'utilisation.
