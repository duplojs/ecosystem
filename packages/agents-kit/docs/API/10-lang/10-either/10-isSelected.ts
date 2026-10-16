/**
 * @title DEither.isSelected
 *
 * Tester une sélection d’informations et affiner l’union d’Either.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

declare const input: DEither.Success<"saved"> | DEither.Left<"missing", Error>;
// La forme curifiée est directement utilisable comme predicate de DCommon.when.
const result = DCommon.pipe(
	input,
	DCommon.when(
		DEither.isSelected({
			success: true,
			missing: false,
		}),
		DEither.unwrapRight,
	),
);

// Le cas sélectionné est extrait ; le Left non sélectionné reste enveloppé.
type _CheckResult = DCommon.ExpectType<typeof result, "saved" | DEither.Left<"missing", Error>, "strict">;

const matches = DEither.isSelected(
	DEither.left("missing", new Error("missing")),
	{ missing: true },
);
type _CheckMatches = DCommon.ExpectType<typeof matches, boolean, "strict">;
