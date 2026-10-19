/**
 * @title DGenerator.createExternalAsyncGenerator
 *
 * Créer un générateur asynchrone dont la prochaine valeur ou la fin sont déclenchées de l’extérieur.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";

const external = DGenerator.createExternalAsyncGenerator<number>();

// L’itérateur attend un appel à `next` et produira ensuite la valeur fournie.
const nextResult = external.next(12);

type _CheckNext = DCommon.ExpectType<typeof nextResult, undefined, "strict">;

// `exit` termine l’itérateur sans produire de valeur.
const exitResult = external.exit();

type _CheckExit = DCommon.ExpectType<typeof exitResult, undefined, "strict">;

type _CheckExternal = DCommon.ExpectType<
	typeof external,
	{
		asyncGenerator: AsyncGenerator<number, void, unknown>;
		next(item: number): undefined;
		exit(): undefined;
	},
	"strict"
>;
