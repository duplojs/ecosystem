/**
 * @title DEither.some
 *
 * Créer un Right représentant une valeur présente dans un Maybe.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const result = DEither.some("Alice");

// La sortie est `Some<"Alice">`, distincte de `None`.
type _CheckResult = DCommon.ExpectType<typeof result, DEither.Some<string>, "strict">;
