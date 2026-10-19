/**
 * @title DGenerator.groupOutput
 *
 * Construire une sortie nommée destinée à la fonction de regroupement.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPattern from "@duplojs/lang/pattern";
import * as DString from "@duplojs/lang/string";

declare const value: number;

// Appel classique : associer directement la valeur au groupe `even`.
const result = DGenerator.groupOutput("even", value);

// La sortie associe le groupe `even` à la valeur fournie.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DGenerator.GroupOutputResult<"even", number>,
	"strict"
>;

// Composition dans un pipe : le pattern `when` sélectionne le premier groupe,
// puis `otherwise` traite le reste sans ouvrir de callback intermédiaire.
const input: string[] = ["a", "bb", "c"];

const piped = DCommon.pipe(
	input,
	DGenerator.group(
		DCommon.innerPipe(
			DPattern.when(
				DString.lengthEqual(1),
				DGenerator.groupOutput("short"),
			),
			DPattern.otherwise(DGenerator.groupOutput("long")),
		),
	),
);

// La sortie vaut { short: ["a", "c"], long: ["bb"] }.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		readonly long?: readonly [string, ...string[]] | undefined;
		readonly short?: readonly [string & DString.LengthEqual<1>, ...(string & DString.LengthEqual<1>)[]] | undefined;
	},
	"strict"
>;
