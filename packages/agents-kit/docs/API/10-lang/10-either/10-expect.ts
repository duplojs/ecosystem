/**
 * @title DEither.expect
 *
 * Retourner un Either sans modifier sa valeur ni son type.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const input = DEither.success("saved");
const result = DEither.expect(input);

// La sortie conserve exactement le Right fourni en entrée.
type _CheckResult = DCommon.ExpectType<typeof result, DEither.Success<"saved">, "strict">;
