/**
 * @title Propager les échecs dans le contrat de retour.
 *
 * Conserver les Left d’une opération dans une fonction réutilisable.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import * as DSFile from "@duplojs/server/file";
import type * as DPath from "@duplojs/lang/path";

async function loadText(path: string & DPath.Path) {
	const result = await DSFile.readTextFile(path);
	if (DEither.isLeft(result)) {
		return result;
	}

	return DEither.right("text-loaded", DEither.unwrapRight(result));
}

type _CheckResult = DCommon.ExpectType<
	Awaited<ReturnType<typeof loadText>>,
	Exclude<DSFile.ReadTextFileResult, DEither.Right> | DEither.Right<"text-loaded", string>,
	"strict"
>;
