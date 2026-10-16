/**
 * @title DCommon.clone
 *
 * Copier récursivement les tableaux et objets simples sans modifier la valeur source.
 */
import * as DCommon from "@duplojs/lang/common";

const source = { nested: { value: 1 } };
const result = DCommon.clone(source);

// La copie conserve la forme typée de l’objet source.
type _CheckResult = DCommon.ExpectType<typeof result, typeof source, "strict">;
