/**
 * @title DCommon.memoObject
 *
 * Exposer un objet calculé paresseusement tout en mémorisant son contenu.
 */
import * as DCommon from "@duplojs/lang/common";

const result = DCommon.memoObject(() => ({ value: "done" }));

// L’objet conserve la forme produite par le getter.
type _CheckResult = DCommon.ExpectType<typeof result, { value: string }, "strict">;
