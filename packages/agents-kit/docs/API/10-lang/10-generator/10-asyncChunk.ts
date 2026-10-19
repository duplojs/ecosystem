/**
 * @title DGenerator.asyncChunk
 *
 * Regrouper les valeurs d’un itérable asynchrone en sous-itérables de taille bornée.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

const input = (async function *() {
	await DCommon.timeout();
	yield 1 as number;
	yield 2 as number;
	yield 3 as number;
})();

// Appel classique : les valeurs sont produites dans des groupes d’au plus deux éléments.
const result = DGenerator.asyncChunk(input, 2);

// La sortie est un AsyncGenerator qui produit [[1, 2], [3]].
type _CheckResult = DCommon.ExpectType<
	typeof result,
	AsyncGenerator<
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
	(async function *() {
		await DCommon.timeout();
		yield 1 as number;
		yield 2 as number;
		yield 3 as number;
		yield 4 as number;
	})(),
	DGenerator.asyncChunk(3),
	DArray.from,
);

// La promesse se résout vers [[1, 2, 3], [4]].
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	Promise<readonly (
		& readonly number[]
		& DArray.MinElements<1>
		& DArray.MaxElements<3>
	)[]>,
	"strict"
>;
