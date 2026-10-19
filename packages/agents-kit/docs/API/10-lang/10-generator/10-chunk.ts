/**
 * @title DGenerator.chunk
 *
 * Regrouper les valeurs d’un itérable en sous-itérables de taille bornée.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

const input: number[] = [1, 2, 3, 4, 5];

// Appel classique : les valeurs sont produites dans des groupes d’au plus deux éléments.
const result = DGenerator.chunk(input, 2);

// La sortie est un générateur qui produit [[1, 2], [3, 4], [5]].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Generator<
		& readonly number[]
		& DArray.MinElements<1>
		& DArray.MaxElements<2>,
		unknown,
		unknown
	>,
	"strict"
>;

// Appel curifié : la taille est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	input,
	DGenerator.chunk(3),
	DArray.from,
);

// La sortie vaut [[1, 2, 3], [4, 5]].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	readonly (
		& readonly number[]
		& DArray.MinElements<1>
		& DArray.MaxElements<3>
	)[],
	"strict"
>;
