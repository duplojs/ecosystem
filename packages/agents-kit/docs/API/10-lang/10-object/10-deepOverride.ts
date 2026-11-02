/**
 * @title DObject.deepOverride
 *
 * Remplacer récursivement les valeurs définies d’un objet sans modifier la source.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

const source = {
	profile: {
		name: "Duplo",
		active: false,
	},
};

const result = DObject.deepOverride(source, {
	profile: {
		active: true,
	},
});

// La valeur obtenue conserve la forme de la source avec active à true.
type _CheckResult = DCommon.ExpectType<typeof result, typeof source, "strict">;

const piped = DCommon.pipe(
	source,
	DObject.deepOverride({
		profile: {
			name: "AgentKit",
		},
	}),
);

// La forme curifiée effectue le même remplacement récursif dans un pipe.
type _CheckPiped = DCommon.ExpectType<typeof piped, typeof source, "strict">;
