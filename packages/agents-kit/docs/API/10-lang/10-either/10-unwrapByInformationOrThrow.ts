/**
 * @title DEither.unwrapByInformationOrThrow
 *
 * Extraire une information ciblée ou lever une exception si elle est absente.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

const direct = DEither.unwrapByInformationOrThrow(DEither.success("saved"), "success");
type _CheckDirect = DCommon.ExpectType<typeof direct, "saved", "strict">;

// Appel curifié : l’information attendue est configurée dans le pipe.
const piped = DCommon.pipe(
	DEither.left("missing", new Error("missing")),
	DEither.unwrapByInformationOrThrow("missing"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, Error, "strict">;

// Une information absente provoque `HasNotInformationError` au runtime.
