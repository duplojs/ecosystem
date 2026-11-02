/**
 * @title DObject.override
 *
 * Remplacer les propriétés définies d’un objet par de nouvelles valeurs.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

const source = {
	name: "Duplo",
	version: 1,
};
const result = DObject.override(source, { version: 2 });

// La valeur obtenue est { name: "Duplo", version: 2 }.
type _CheckResult = DCommon.ExpectType<typeof result, typeof source, "strict">;

const piped = DCommon.pipe(
	source,
	DObject.override({ name: "AgentKit" }),
);

// La forme curifiée remplace seulement les propriétés définies dans la valeur d’override.
type _CheckPiped = DCommon.ExpectType<typeof piped, typeof source, "strict">;
