/**
 * @title DGenerator.group
 *
 * Regrouper les valeurs d’un itérable selon les sorties nommées d’une callback.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DString from "@duplojs/lang/string";

const input: string[] = ["a", "bb", "c"];

// Appel classique : chaque valeur est ajoutée au groupe dont le nom dépend de sa longueur.
// Le ternaire porte sur la structure entière : `group` devient un discriminant littéral.
const result = DGenerator.group(
	input,
	(item, params) => DString.lengthEqual(item, 1)
		? params.output("short", item)
		: params.output("long", item),
);

// La sortie vaut { short: ["a", "c"], long: ["bb"] }.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	{
		readonly long?: readonly [string, ...string[]] | undefined;
		readonly short?: readonly [string & DString.LengthEqual<1>, ...(string & DString.LengthEqual<1>)[]] | undefined;
	},
	"strict"
>;

// Appel curifié : le regroupement est configuré dans l’étape du pipe.
const piped = DCommon.pipe(
	input,
	DGenerator.group((item, params) => params.output("value", item)),
);

// La sortie vaut { value: ["a", "bb", "c"] }.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		readonly value?: readonly [string, ...string[]] | undefined;
	},
	"strict"
>;
