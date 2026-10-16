/**
 * @title DDataStructure.createErrorInterpreter
 *
 * Transformer les issues d’une erreur de validation ou de codec en messages interprétables.
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

// Une erreur conserve les sources techniques de chaque issue : structure,
// type, contrainte ou codec.
const error = DCommon.pipe(
	checkResult,
	DEither.unwrapByInformationOrThrow("check-error"),
);

type _CheckError = DCommon.ExpectType<
	typeof error,
	DDataStructure.Error,
	"strict"
>;

// Les dictionnaires par défaut produisent des messages génériques pour les
// structures, types, contraintes et codecs fournis par DuploJS.
const dataStructureDictionary = {
	...DDataStructure.defaultErrorInterpreterDataStructureDictionary,
	"@DuplojsLangDataStructure/email-constraint": (source, issue) => {
		type _CheckSource = DCommon.ExpectType<
			typeof source,
			DDataStructure.EmailConstraint,
			"strict"
		>;
		type _CheckIssue = DCommon.ExpectType<
			typeof issue,
			DDataStructure.Issue,
			"strict"
		>;

		return `Invalid email at ${issue.path}: ${source.definition.message}`;
	},
	"@DuplojsLangDataStructure/greater-than-or-equal-constraint": (source) => (
		`Expected a value greater than or equal to ${source.definition.threshold}.`
	),
} satisfies DDataStructure.StructureDictionaryParams;

const interpretError = DDataStructure.createErrorInterpreter(
	dataStructureDictionary,
	DDataStructure.defaultErrorInterpreterCodecDictionary,
);

// L’interpréteur renvoie une issue enrichie, sans perdre la donnée, le chemin
// ni la source de l’erreur d’origine.
const interpretedIssues = interpretError(error);

type _CheckInterpretedIssues = DCommon.ExpectType<
	typeof interpretedIssues,
	readonly DDataStructure.InterpretedIssues[],
	"strict"
>;

// Les dictionnaires peuvent être omis lorsque l’application veut seulement
// enrichir les issues avec leurs champs `interpretedMessage` optionnels.
const interpretWithoutDictionaries = DDataStructure.createErrorInterpreter();
const uninterpretedIssues = interpretWithoutDictionaries(error);
