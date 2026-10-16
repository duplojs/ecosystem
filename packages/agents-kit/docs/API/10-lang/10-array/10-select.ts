/**
 * @title DArray.select
 *
 * Transformer sélectivement les éléments avec select et ignorer les autres avec skip.
 */
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";

const numbers = [1, 2, 3];

// Appel classique : les nombres pairs sont transformés et les autres ignorés.
const result = DArray.select(numbers, ({ element, select, skip }) => element % 2 === 0
	? select(`even-${element}`)
	: skip());

// La valeur obtenue est ["even-2"].
type _CheckResult = DCommon.ExpectType<typeof result, `even-${number}`[], "strict">;

// Appel curifié : la décision de sélection est configurée dans l’étape du pipe.
const piped = DCommon.pipe(
	numbers,
	DArray.select(({ element, select }) => select(element * 10)),
);

// La valeur obtenue est [10, 20, 30].
type _CheckPiped = DCommon.ExpectType<typeof piped, number[], "strict">;
