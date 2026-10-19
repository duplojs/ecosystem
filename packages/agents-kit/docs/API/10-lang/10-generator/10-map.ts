/**
 * @title DGenerator.map
 *
 * Transformer chaque valeur d’un itérable dans un générateur.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import * as DNumber from "@duplojs/lang/number";

const input = [1, 2, 3] as const;

// Appel classique : chaque nombre est doublé.
const result = DGenerator.map(input, (item) => DNumber.sum([item, item]));

// La sortie est un générateur qui produit [2, 4, 6].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Generator<number, unknown, unknown>,
	"strict"
>;

// Appel curifié : la transformation est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	input,
	DGenerator.map((item) => DNumber.sum([item, item, item])),
	DArray.from,
);

// La sortie vaut [3, 6, 9].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly number[],
	"strict"
>;
