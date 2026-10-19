/**
 * @title DGenerator.asyncGroup
 *
 * Regrouper les valeurs d’un itérable asynchrone selon les sorties nommées d’une callback.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const input = (async function *() {
	await DCommon.timeout();
	yield 1 as number;
	yield 2 as number;
	yield 3 as number;
})();

// Appel classique : chaque valeur est ajoutée au groupe dont le nom dépend de sa parité.
// Le ternaire porte sur la structure entière : `group` devient un discriminant littéral.
const result = DGenerator.asyncGroup(
	input,
	(item, params) => DNumber.isEven(item)
		? params.output("even", item)
		: params.output("odd", item),
);

// La promesse se résout vers { odd: [1, 3], even: [2] }.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<{
		readonly even?: readonly [number & DNumber.Even, ...(number & DNumber.Even)[]] | undefined;
		readonly odd?: readonly [number, ...number[]] | undefined;
	}>,
	"strict"
>;

// Appel curifié : le regroupement est configuré dans l’étape du pipe.
const values: string[] = ["a", "bb", "c"];

const piped = DCommon.pipe(
	values,
	DGenerator.asyncMap(async(item) => {
		await DCommon.timeout();
		return item;
	}),
	DGenerator.asyncGroup(async(item, params) => {
		await DCommon.timeout();
		return DString.lengthEqual(item, 1)
			? params.output("short", item)
			: params.output("long", item);
	}),
);

// La promesse se résout vers { short: ["a", "c"], long: ["bb"] }.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	Promise<{
		readonly long?: readonly [string, ...string[]] | undefined;
		readonly short?: readonly [
			string & DString.LengthEqual<1>,
			...(string & DString.LengthEqual<1>)[],
		] | undefined;
	}>,
	"strict"
>;
