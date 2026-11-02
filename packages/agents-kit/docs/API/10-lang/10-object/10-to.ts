/**
 * @title DObject.to
 *
 * Construire un nouvel objet en appliquant une forme de transformations à une même entrée.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";
import type * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";

const result = DObject.to("Duplo", {
	upper: DString.toUpperCase,
	length: DString.length,
});

// La valeur obtenue est { upper: "DUPLO", length: 5 }.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	{
		upper: Uppercase<string>;
		length: number & DNumber.Positive;
	},
	"strict"
>;

const piped = DCommon.pipe(
	"AgentKit",
	DObject.to({
		upper: DString.toUpperCase,
	}),
);

// La forme curifiée applique la forme au texte reçu par le pipe.
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	{
		upper: "AGENTKIT";
	},
	"strict"
>;
